import type { FastifyReply, FastifyRequest } from "fastify"
import jwt from 'jsonwebtoken'

type JWTPayload = {
    sub: string
    role: 'Student' | 'Manager'
}

export async function checkRequestJWT(request: FastifyRequest, reply: FastifyReply) {
    const token = request.headers.authorization
    console.log(token)
    if (!token) {
        return reply.status(401).send({ message: 'Unauthorized' })
    }
    console.log(process.env.JWT_SECRET)

    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
        throw new Error('JWT_SECRET is not defined')
    }
    try {
        console.log(process.env.JWT_EXPIRES_IN)
        const expiresIn = parseInt(process.env.JWT_EXPIRES_IN)
        const payload = jwt.verify(token, process.env.JWT_SECRET, { maxAge: expiresIn }) as JWTPayload
        console.log(payload)
        request.user = payload
    } catch (error) {
        console.log('Invalid JWT Token', error)
        return reply.status(401).send({ message: 'Unauthorized' })
    }
}
