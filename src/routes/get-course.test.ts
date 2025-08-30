import { expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app'
import { makeCourse } from '../tests/factories/make-couse.ts'
import { randomUUID } from 'node:crypto'
import { makeAuthUser } from '../tests/factories/make-user.ts'



test('Get course', async () => {

    await server.ready()
    const titleId = randomUUID()
    const { token } = await makeAuthUser('Manager')
    const course = await makeCourse(titleId)
    const response = await request(server.server)
        .get(`/courses?search=${titleId}`)
        .set('Authorization', token)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
        total: 1,
        courses: [
            {
                id: expect.any(String),
                title: titleId,
                enrollments: 0,
            }
        ]
    })
})