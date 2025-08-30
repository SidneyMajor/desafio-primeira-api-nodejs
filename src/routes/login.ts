
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { users } from "../database/schema.ts"
import { eq } from "drizzle-orm"
import z from "zod"
import { verify } from "argon2"
import jwt from 'jsonwebtoken'



export const loginRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/sessions', {
        schema: {
            tags: ['auth'],
            summary: 'User login',
            description: 'This endpoint allows users to log in',
            body: z.object({
                email: z.email("Invalid email address"),
                password: z.string().min(6, "The password must be at least 6 characters long")
            }),
            response: {
                200: z.object({
                    message: z.string(),
                    token: z.string()
                }),
                400: z.object({
                    message: z.string()
                })
            }
        },
    }, async (request, reply) => {

        const { email, password } = request.body

        const result = await db
            .select()
            .from(users)
            .where(eq(users.email, email))

        if (result.length === 0) {
            return reply.status(400).send({ message: 'credentials are invalid' })
        }

        const user = result[0]

        const doesPasswordMatch = await verify(user.password, password)

        if (!doesPasswordMatch) {
            return reply.status(400).send({ message: 'credentials are invalid' })
        }

        if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
            throw new Error('JWT data is not defined')
        }

        const expiresIn = parseInt(process.env.JWT_EXPIRES_IN)

        const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: expiresIn })

        return reply.code(200).send({ message: 'Login successful', token })
    })

}