import getUserId from './../utils/getuserid'

//User object gets related data from the original call and is neede to make Author-> Post and Author-> comments relationship
const User = {
    email(parent,args,{request},info){
        const userId = getUserId(request,false)

        if(userId && userId === parent.id){
            return parent.email
        }else{
            return null
        }
    }
}

export { User as default }