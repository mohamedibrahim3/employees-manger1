import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      name: string
      email: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    username: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
  }
}