import {signOut, useSession} from 'next-auth/react';

export default function Home() {
    const { data: session } = useSession();
    const user = session?.user;
  return (
      <>
          <div>
            <span>{`Hello, you're logged in as ${user?.name}!`}</span>
          </div>
          <div>
            <a href="#" onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}>
              logout
            </a>
          </div>
      </>
  )
}
