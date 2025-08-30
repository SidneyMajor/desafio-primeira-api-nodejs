
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import z from "zod"
import { checkRequestJWT } from "./hooks/check-request-jwt.ts"
import { checkUserRole } from "./hooks/check-user-role.ts"

export const createCoursesRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/courses', {
        preHandler: [
            checkRequestJWT,
            checkUserRole('Manager'),
        ],
        schema: {
            tags: ['Courses'],
            summary: 'Create a new course',
            description: 'This endpoint creates a new course',
            body: z.object({
                title: z.string().min(5, "The title must be at least 5 characters long")
            }),
            response: {
                201: z.object({
                    courseId: z.uuid()
                }).describe('Course created response')
            }
        },
    }, async (request, reply) => {

        const courseTitle = request.body.title

        const result = await db
            .insert(courses)
            .values({
                title: courseTitle
            })
            .returning()

        return reply.code(201).send({ courseId: result[0].id })
    })

}