import { expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app'
import { makeCourse } from '../tests/make-couse.ts'
import { randomUUID } from 'node:crypto'



test('Get course by ID', async () => {

    await server.ready()
    const course = await makeCourse()
    const response = await request(server.server)
        .get(`/courses/${course.id}`)

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
    const response = await request(server.server)
        .get(`/courses/${courseIdId}`)

    expect(response.status).toEqual(404)
})

