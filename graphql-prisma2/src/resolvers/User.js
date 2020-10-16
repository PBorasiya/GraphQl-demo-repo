import getUserId from './../utils/getuserid'


//User object gets related data from the original call and is neede to make Author-> Post and Author-> comments relationship
const User = {
    posts:{
        fragment : 'fragment userId on User { id }',
        resolve(parent, args, {prisma}, info){
            return prisma.query.posts({
                where :{
                    published : true,
                    author : {
                        id : parent.id
                    }
                }
            })
        }
    },
    email:{
        fragment: 'fragment userId on User { id }',
        resolve(parent,args,{request},info){
            const userId = getUserId(request,false)
    
            if(userId && userId === parent.id){
                return parent.email
            }else{
                return null
            }
        }
    }
}

export { User as default }