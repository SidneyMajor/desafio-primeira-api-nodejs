import { expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { faker } from '@faker-js/faker'
import { makeAuthUser } from '../tests/factories/make-user.ts'



test('create course', async () => {

    await server.ready()
    const { token } = await makeAuthUser('Manager')
    const response = await request(server.server)
        .post('/courses')
        .set('content-type', 'application/json')
        .set('Authorization', token)
        .send({
            title: faker.lorem.word(5),
            description: faker.commerce.productName(),
        })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
        courseId: expect.any(String),
    })
})