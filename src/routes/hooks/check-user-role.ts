import type { FastifyReply, FastifyRequest } from "fastify"
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts"

export function checkUserRole(role: 'Student' | 'Manager') {
    return async function (request: FastifyRequest, reply: FastifyReply) {
        const user = getAuthenticatedUserFromRequest(request)
        console.log(request)
        if (user.role !== role) {
            return reply.status(401).send({ message: 'Unauthorized' })
        }
    }
}