import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts"
import { users } from "../../database/schema.ts";
import { randomUUID } from "node:crypto";
import { hash } from "argon2";
import jwt from 'jsonwebtoken'


export async function makeUser(role?: 'Student' | 'Manager') {
    const passwordBeforeHash = randomUUID()
    const userInsert = await db.insert(users)
        .values(
            {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: await hash(passwordBeforeHash),
                role
            })
        .returning()

    return { user: userInsert[0], passwordBeforeHash }
}


export async function makeAuthUser(role: 'Student' | 'Manager') {
    const { user } = await makeUser(role)

    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
        throw new Error('JWT data is not defined')
    }
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN)

    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: expiresIn })
    return { user, token }
}