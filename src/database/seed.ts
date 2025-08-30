import { db } from "./client.ts"
import { users, courses, enrollments } from "./schema.ts"
import { faker } from '@faker-js/faker'

async function seedDatabase() {
    const userInsert = await db.insert(users).values([
        { name: faker.person.fullName(), email: faker.internet.email() },
        { name: faker.person.fullName(), email: faker.internet.email() },
        { name: faker.person.fullName(), email: faker.internet.email() },
        { name: faker.person.fullName(), email: faker.internet.email() },
        { name: faker.person.fullName(), email: faker.internet.email() },
        { name: faker.person.fullName(), email: faker.internet.email() },
    ]).returning()

    const courseInsert = await db.insert(courses).values([
        { title: 'Introduction to Programming', description: 'Learn the basics of programming.' },
        { title: 'Advanced TypeScript', description: 'Master TypeScript for large applications.' },
        { title: 'Database Design', description: 'Learn how to design databases effectively.' },
    ]).returning()

    await db.insert(enrollments).values([
        { userId: userInsert[0].id, courseId: courseInsert[0].id },
        { userId: userInsert[1].id, courseId: courseInsert[0].id },
        { userId: userInsert[2].id, courseId: courseInsert[1].id },
        { userId: userInsert[3].id, courseId: courseInsert[1].id },
        { userId: userInsert[4].id, courseId: courseInsert[2].id },
        { userId: userInsert[5].id, courseId: courseInsert[2].id },
    ])
}

seedDatabase()
