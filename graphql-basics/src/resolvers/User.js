//User object gets related data from the original call and is neede to make Author-> Post and Author-> comments relationship
const User = {
    posts(parent,args,{db},info){
        return db.posts.filter((post) => {
            return post.author === parent.id
        }) 
    },

    comments(parent,args,{db},info){
        return db.comments.filter((Comment) => {
            return Comment.author == parent.id
        })
    }
}