import uuidv4 from 'uuid/v4'

const Mutation =  {
    createUser(parent, args, { db }, info){
       const emailTaken = db.users.some((user) => user.email === args.data.email)

       if(emailTaken){
           throw new Error('email already taken.')
       }

       const user = {
            id : uuidv4(),
            ...args.data
       }

       db.users.push(user)

       return user
    },
    deleteUser(parent, args, { db }, info){
        const userIndex = db.users.findIndex((user) => user.id === args.id)

        if(userIndex === -1){
            throw new Error('User not found.')
        }

        const deletedUsers = db.users.splice(userIndex,1,)

        db.posts = db.posts.filter((post) => {
            const match = post.author === args.id

            if(match){
                db.comments = db.comments.filter((comment) => {
                    return Comment.post !== post.id
                })
            }

            db.comments = db.comments.filter((comment) => comment.author !== args.id)

            return !match
        })

        return deletedUsers[0]
    },
    updateUser(parent, args , {db}, info){
        const user = db.users.find((user) => user.id === args.id)

        if(!user){
            throw new Error('User not found.')
        }

        if(typeof args.data.email === 'string'){
            const emailTaken = db.users.some((user) => user.email === args.data.email)

            if(emailTaken){
                throw new Error('Email in use.')
            }

            user.email = args.data.email
        }

        if(typeof args.data.name === 'string'){
            user.name = args.data.name
        }

        if(typeof args.data.age !== 'undefined'){
            user.age = args.data.age
        }

        return user
    },
    createPost(parent, args, { db , pubsub}, info){
        const userExists = db.users.some((user) => user.id === args.data.author)

        if(!userExists){
            throw new Error('User does not exist')
        }

        const post = {
            id : uuidv4(),
            ...args.data
        }

        db.posts.push(post)

        if(args.data.published){
            pubsub.publish('post',{ 
                post : {
                    mutation : 'CREATED',
                    data: post
                }
             })
        }
        

        return post
    },
    deletePost(parent, args, {db , pubsub}, info){
        const postIndex = db.posts.findIndex((post) => post.id === args.id)

        if(postIndex === -1){
            throw new Error('Post does not exist.')
        }

        const [post] = db.posts.splice(postIndex,1)

        db.comments = db.comments.filter((comment) => comment.post !== args.id)

        if(post.published){
            pubsub.publish('post', {
                post : {
                    mutation : 'DELETED',
                    data : post
                }
            })
        }
        
        return post

    },
    updatePost(parent, args, {db} , info){
        const post = db.posts.find((post) => post.id === args.id)

        if(!post){
            throw new Error('Post does not exist')
        }

        if(typeof args.data.title === 'string'){
            post.title = args.data.title
        }

        if(typeof args.data.body === 'string'){
            post.body = args.data.body
        }

        if(typeof args.data.published === 'boolean'){
            post.published = args.data.published
        }

        return post
    },
    createComment(parent, args, {db,pubsub}, info){
        const userExists = db.users.some((user) => user.id === args.data.author)
        const postExists = db.posts.some((post) => post.id === args.data.post && post.published)

        if(!userExists){
            throw new Error('User does not exist')
        }

        if(!postExists){
            throw new Error('Post does not exist')
        }

        const comment = {
            id : uuidv4(),
            ...args.data
        }

        db.comments.push(comment)
        pubsub.publish(`comment ${args.data.post}`, {comment})

        return comment
    },
    deleteComment(parent, args, {db}, info){
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)

        if(commentIndex === -1){
            throw new Error('Comment does not exist')
        }

        const deletedComments = db.comments.splice(commentIndex,1)

        return deletedComments[0]
    },
    updateComment(parent, args, {db}, info){
        const comment = db.comments.find((Comment) => Comment.id === args.id)

        if(!comment){
            throw new Error('Comment does not exist.')
        }

        if(typeof args.data.text === 'string'){
            comment.text = args.data.text
        }

        return comment
    }
}

export { Mutation as default }