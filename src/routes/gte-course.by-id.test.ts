import { expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app'
import { makeCourse } from '../tests/factories/make-couse.ts'
import { randomUUID } from 'node:crypto'
import { makeAuthUser } from '../tests/factories/make-user.ts'



test('Get course by ID', async () => {

    await server.ready()
    const { token } = await makeAuthUser('Student')
    const course = await makeCourse()
    const response = await request(server.server)
        .get(`/courses/${course.id}`)
        .set('Authorization', token)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
        course: {
            id: expect.any(String),
            title: expect.any(String),
            description: expect.any(String),
        }
    })
})


test('returns 404 for non-existing course', async () => {

    await server.ready()
    const courseIdId = randomUUID()
    const { token } = await makeAuthUser('Student')
    const response = await request(server.server)
        .get(`/courses/${courseIdId}`)
        .set('Authorization', token)

    expect(response.status).toEqual(404)
})

