//User object gets related data from the original call and is neede to make Comment-> Author and Comment-> Post relationship
const Comment = {
    author(parent,args,{db},info){
        return db.users.find((user) =>{
            return user.id === parent.author
        })
    },
    post(parent, args, {db}, info){
        return db.posts.find((post) => {
            return post.id === parent.post
        })
    }
}

export { Comment as default }