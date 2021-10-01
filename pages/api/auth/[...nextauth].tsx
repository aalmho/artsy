import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../../../lib/clients/prisma"

export default NextAuth({
    providers: [
        Providers.Email({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SEVER_PASSWORD,
                }
            },
            from: process.env.EMAIL_FROM
        }),
        Providers.Facebook({
            clientId: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
        }),
    ],
    adapter: PrismaAdapter(prisma),
    callbacks: {
        session: async (session, user) => {
            session.userId = user.id;
            return Promise.resolve(session);
        }
    }
})