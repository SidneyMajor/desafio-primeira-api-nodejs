import { faker } from "@faker-js/faker";
import { db } from "../database/client.ts";
import { courses } from "../database/schema";


export async function makeCourse(title?: string) {
    const courseInsert = await db.insert(courses)
        .values({ title: title ?? faker.lorem.word(5), description: faker.commerce.productDescription() })
        .returning()

    return courseInsert[0]
}