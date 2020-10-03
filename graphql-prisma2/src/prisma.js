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

const createPostForUser = async(authorId, data) =>{

    const userExists = await prisma.exists.User({ id : authorId})

    if(!userExists){
        throw new Error('User not found')
    }

    const post = await prisma.mutation.createPost({
        data : {
            ...data,
            author : {
                connect : {
                    id : authorId
                }
            }
        }
    }, '{ author {id name email posts{id title body published}}}')
    
    return post.author
}

// createPostForUser('ckfrhqmxl00110779i1zelp7z', {
//     title : 'How to get your man listening to you 2.0',
//     body : 'They do listen, they just ignore you for sports. so wait for game to be over then talk',
//     published : true
// }).then((user)=>{
//     console.log(JSON.stringify(user,undefined,4))
//  }).catch((error)=>{
//     console.log(error.message)
// })



const updatePostForUser = async(postId, data) =>{

    const postExists = await prisma.exists.Post({ id : postId})

    if(!postExists){
        throw new Error('Post does not exist')
    }

    const post = await prisma.mutation.updatePost({
        where : {
            id : postId
        },
        data
    }, '{author {id name email posts {id title  body published }}}')
    
    return post.author
}

updatePostForUser('ckfswyesw001c0879rfboeton', {
    "title": "How to get your man listening to you 13.0"
}).then((user)=>{
    console.log(JSON.stringify(user,undefined,4))
 }).catch((error)=>{
    console.log(error.message)
})