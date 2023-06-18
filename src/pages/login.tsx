import {signIn, signOut, useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import {useEffect} from 'react';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  });

  return (
    <div>
      <button onClick={() => signIn('zitadel', {
              callbackUrl: '/'})}>
        Login
      </button>
    </div>
  );
}
