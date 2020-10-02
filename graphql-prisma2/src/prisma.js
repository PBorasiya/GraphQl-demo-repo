import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs : 'src/generated/prisma.graphql',
    endpoint : 'http://localhost:4466'
})

// prisma.query.users(null, '{id name email posts{ id body title published}}').then((data)=>{
//     console.log(JSON.stringify(data,undefined,4))
// })

// prisma.query.comments(null, '{id text author{id name email}}').then((data)=>{
//     console.log(JSON.stringify(data,undefined,4))
// })

// prisma.mutation.createPost({
//     data : {
//         title : "new graphqlpost from prisma-binding",
//         body : "ajakkjahfdhfjasjfsafdsaddadjshfahn bjbfhakfhajsd adka dkaxdhakjh  hjfhjkrhanxa",
//         published : true,
//         author : {
//             connect : {
//                 id : "ckfrhrcjt00220779vdpgwtmp"
//             }
//         }
//     }
// },'{id title body author{id name email}}').then((data) =>{
//     console.log(JSON.stringify(data,undefined,4))
//     return prisma.query.users(null, '{id name email posts{ id body title published}}')
// }).then((data)=>{
//     console.log(JSON.stringify(data,undefined,4))
// })

prisma.mutation.updatePost({
    data:{
        published: false
    },
    where : {
        id : "ckfrklqvb00430779gpdua8pk"
    }
},'{id title body author{id name email}}').then((data)=>{
    console.log(JSON.stringify(data,undefined,4))
    return prisma.query.users(null, '{id name email posts{ id body title published}}')
}).then((data)=>{
    console.log(JSON.stringify(data,undefined,4))
})