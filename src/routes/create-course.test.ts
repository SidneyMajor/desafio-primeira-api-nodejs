import { expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { faker } from '@faker-js/faker'



test('create course', async () => {

    await server.ready()

    const response = await request(server.server)
        .post('/courses')
        .set('content-type', 'application/json')
        .send({
            title: faker.lorem.word(5),
            description: faker.commerce.productName(),
        })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
        courseId: expect.any(String),
    })
})