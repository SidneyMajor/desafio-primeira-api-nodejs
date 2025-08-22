import fastify from 'fastify'
import crypto from 'node:crypto'

const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
})

const courses = [
    { id: '1', title: 'Curso de Node.js' },
    { id: '2', title: 'Curso d React' },
    { id: '3', title: 'Curso de React Native' },
]

server.get('/courses', () => {
    return { courses }
})

server.post('/courses', (request, reply) => {

    type Body = {
        title: string
    }
    const courseId = crypto.randomUUID()

    const body = request.body as Body
    const courseTitle = body.title
    if (!courseTitle) {
        return reply.code(400).send("Titulo não encontrado")
    }

    courses.push({ id: courseId, title: courseTitle })

    return reply.code(201).send({ courseId })
})

server.get('/courses/:id', (request, reply) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseId = params.id
    const course = courses.find(course => course.id === courseId)
    if (course) {
        return { course }
    }
    return reply.code(404).send()
})



server.listen({ port: 3333 }).then(() => {
    console.log('HTTP server runnig!')
})