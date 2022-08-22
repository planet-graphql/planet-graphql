import { faker } from '@faker-js/faker'
import { PrismaClient } from './prisma-client'

const prisma = new PrismaClient()

async function clean() {
  await prisma.attachment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()
}

async function createData(userCount = 20, taskCount = 5) {
  for (const userId of Array.from({ length: userCount }).keys()) {
    const firstName = faker.name.firstName()
    await prisma.user.create({
      data: {
        id: userId,
        firstName,
        lastName: faker.name.lastName(),
        email: faker.internet.email(firstName),
        posts: {
          create: [...Array.from({ length: taskCount }).keys()].map((taskId) => ({
            id: userId * userCount + taskId,
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraph(),
            isPublic: faker.helpers.arrayElement([true, false]),
            tags: faker.random.words(),
            attachments: {
              create: [
                ...Array.from({ length: Number(faker.random.numeric()) }).keys(),
              ].map(() => ({
                name: faker.system.fileName(),
                buffer: Buffer.from(''),
                meta: {},
                size: faker.random.numeric(9),
              })),
            },
          })),
        },
      },
    })
  }
}

async function seed() {
  await clean()
  await createData()
}

void seed()
