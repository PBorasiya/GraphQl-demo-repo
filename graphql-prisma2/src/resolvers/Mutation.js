import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from './../utils/getuserid'
const Mutation =  {
    async loginUser(parent, args, {prisma}, info){
        const user = await prisma.query.user({
            where:{
                email : args.data.email
            }
        })
        
        if(!user){
            throw new Error('Unable to log in')
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if(!isMatch){
            throw new Error('Unable to login')
        }

        return {
            user,
            token : jwt.sign({userId : user.id} , 'thisisasecret')
        }
    },
    async createUser(parent, args, { prisma }, info){

        if(args.data.password.length < 8){
            throw new Error('Password must be 8 characters or longer.')
        }

        const password = await bcrypt.hash(args.data.password, 10)

       const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
         })

         return {
             user,
             token: jwt.sign({ userId : user.id}, 'thisisasecret')
         }

    },
    async deleteUser(parent, args, { prisma, request  }, info){

        const userId = getUserId(request)


        return prisma.mutation.deleteUser({
            where :{
                id : userId
        }}, info)
        
    },
    async updateUser(parent, args , { prisma, request }, info){

        const userId = getUserId(request)

        return prisma.mutation.updateUser({
            where:{
                id : userId
            },
            data : args.data
        },info)
        
    },
    async createPost(parent, args, { prisma, request }, info){

        const userId = getUserId(request)


        return prisma.mutation.createPost({
            data :{
                title : args.data.title,
                body : args.data.body,
                published : args.data.published,
                author : {
                    connect : {
                        id : userId
                    }
                }
            }
        }, info)

    },
    async deletePost(parent, args, { prisma, request }, info){

        const userId = getUserId(request)

        const postExists = await prisma.exists.Post({ 
            id : args.id,
            author : {
                id :userId
            }
        })

        if(!postExists){
            throw new Error('Operation failed.')
        }

        return prisma.mutation.deletePost({
            where:{
                id : args.id
            }
        },info)

    },
    async updatePost(parent, args, { prisma, request } , info){

        const userId = getUserId(request)

        const postExists = await prisma.exists.Post({
            id : args.id,
            author : {
                id : userId
            }
        })

        if(!postExists){
            throw new Error('Operation failed.')
        }


        return prisma.mutation.updatePost({
            data : args.data,
            where : {
                id : args.id
            }
        }, info)
        
    },
    async createComment(parent, args, { prisma, request }, info){

        const userId = getUserId(request)



        return prisma.mutation.createComment({
            data:{
                text : args.data.text,
                author : {
                    connect : {
                        id : userId
                    }
                },
                post : {
                    connect : {
                        id : args.data.post
                    }
                }
            }

        }, info)
    },
    async deleteComment(parent, args, { prisma }, info){
        return prisma.mutation.deleteComment({
            where:{
                id : args.id
            }
        }, info)
    },
    async updateComment(parent, args, { prisma }, info){
        return prisma.mutation.updateComment({
            where:{
                id : args.id
            },
            data : args.data
        }, info)
    }
}

export { Mutation as default }