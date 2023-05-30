import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import ZitadelProvider from 'next-auth/providers/zitadel';
import { Issuer } from 'openid-client';
import {User} from "@/next-auth";
async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const issuer = await Issuer.discover(process.env.ZITADEL_ISSUER ?? '');
        const client = new issuer.Client({
            client_id: process.env.ZITADEL_CLIENT_ID || '',
            token_endpoint_auth_method: 'none',
        });

        const { refresh_token, access_token, expires_at } = await client.refresh(token.refreshToken as string);

        return {
            ...token,
            accessToken: access_token,
            expiresAt: (expires_at ?? 0) * 1000,
            refreshToken: refresh_token, // Fall back to old refresh token
        };
    } catch (error) {
        console.error('Error during refreshAccessToken', error);

        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
}

export default NextAuth({
    providers: [
        ZitadelProvider({
            issuer: process.env.ZITADEL_ISSUER,
            clientId: process.env.ZITADEL_CLIENT_ID,
            clientSecret: process.env.ZITADEL_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: `openid email profile`,
                },
            },
            async profile(_, { access_token }) {
                const { userinfo_endpoint } = await (
                    await fetch(`${process.env.ZITADEL_ISSUER}/.well-known/openid-configuration`)
                ).json();

                const profile = await (
                    await fetch(userinfo_endpoint, {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    })
                ).json();

                return {
                    id: profile.sub,
                    name: profile.given_name,
                    email: profile.email,
                    image: profile.picture,
                }
            },
        }),
    ],
    session: {
        maxAge: 12 * 60 * 60, // 12 hours
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.expiresAt = (account.expires_at as number) * 1000;
            }
            if (user) {
                token.user = user as User;
            }

            if (Date.now() > (token.expiresAt as number)) {
                delete token.accessToken;
            }

            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.user = token.user;
            session.accessToken = token.accessToken;
            return session;
        },
    },
});