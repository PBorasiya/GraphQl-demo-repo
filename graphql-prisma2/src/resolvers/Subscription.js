import getUserId from './../utils/getuserid'

const Subscription = {
   comment : {
       subscribe(parent, {postId}, { prisma } ,  info){

        return prisma.subscription.comment({
            where : {
                node : {
                    post : {
                        id : postId
                    }
                }
            }
        },info)
       }
   },
   post : {
       subscribe(parent , args , { prisma } ,info){
           
        return prisma.subscription.post({
            where : {
                node : {
                    published : true
                }
            }
        },info)
       

       }
   },
   myPosts:{
       subscribe(parent,args,{prisma,request}, info){
            const userId = getUserId(request)

        return prisma.subscription.post({
            where : {
                node : {
                    author : {
                        id : userId
                    }
                }
            }
        }, info)
       }
   }
}

export { Subscription as default }