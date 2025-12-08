import { handlers } from "@/lib/auth"

export const { GET, POST } = handlersimport NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
