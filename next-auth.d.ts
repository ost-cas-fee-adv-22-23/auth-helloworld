import 'next-auth/jwt';


export type User = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    picture: string;
    username: string;
    avatarUrl?: string;
}

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        user: User;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string;
        user?: User;
        refreshToken?: string;
        expiresAt?: number;
        error?: string;
    }
}