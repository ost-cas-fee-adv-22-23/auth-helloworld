import 'next-auth/jwt';
import {User} from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: User;

  }

  interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    image?: string;
    username: string;
    avatarUrl?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    user?: User;
  }
}
