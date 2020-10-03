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


// prisma.mutation.updatePost({
//     data:{
//         published: false
//     },
//     where : {
//         id : "ckfrklqvb00430779gpdua8pk"
//     }
// },'{id title body author{id name email}}').then((data)=>{
//     console.log(JSON.stringify(data,undefined,4))
//     return prisma.query.users(null, '{id name email posts{ id body title published}}')
// }).then((data)=>{
//     console.log(JSON.stringify(data,undefined,4))
// })

// const createPostForUser = async(authorId, data) =>{
//     const post = await prisma.mutation.createPost({
//         data : {
//             ...data,
//             author : {
//                 connect : {
//                     id : authorId
//                 }
//             }
//         }
//     }, '{ id }')
//     const user = await prisma.query.user({
//         where : {
//             id : authorId
//         }
//     }, '{id name email posts{ id title body published}}')
//     return user
// }

// createPostForUser('ckfrhqmxl00110779i1zelp7z', {
//     title : 'How to get your man listening to you',
//     body : 'They do listen, they just ignore you for sports. so wait for game to be over then talk',
//     published : true
// }).then((user)=>{
//     console.log(JSON.stringify(user,undefined,4))
// })

const updatePostForUser = async(postId, data) =>{
    const post = await prisma.mutation.updatePost({
        where : {
            id : postId
        },
        data
    }, '{author {id name email}}')
    const user = await prisma.query.user({
        where:{
            id : post.author.id
        }
    }, '{id name email posts {id title published}}')
    return user
}

updatePostForUser('ckfswyesw001c0879rfboeton', {
    "title": "How to get your man listening to you 3.0"
}).then((user)=>{
    console.log(JSON.stringify(user,undefined,4))
})