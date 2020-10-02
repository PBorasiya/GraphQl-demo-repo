import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs : 'src/generated/prisma.graphql',
    endpoint : 'http://localhost:4466'
})

prisma.query.users(null, '{id name email posts{ id body title published}}').then((data)=>{
    console.log(JSON.stringify(data,undefined,4))
})

prisma.query.comments(null, '{id text author{id name email}}').then((data)=>{
    console.log(JSON.stringify(data,undefined,4))
})