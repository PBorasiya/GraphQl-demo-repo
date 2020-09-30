const Query = {
    me() {
        return {
            id: "123098",
            name: "Pranav",
            email: "example.com",
            age: 28
        }
    },
    post() {
        return {
            id: '12kejej12',
            title: "GraphQl 101",
            body: "Welcome to the introductory course on GraphQL",
            published: true
        }
    },
    users(parent, args, { db }, info) {

        if(!args.query){
            return db.users
        }

        return db.users.filter((user) => {
               return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    
    posts(parent, args, { db }, info){
        if(!args.query){
            return db.posts
        }

        return db.posts.filter((post) => {
            const isTitleMatch =  post.title.toLowerCase().includes(args.query.toLowerCase())
            const isBodyMatch =  post.body.toLowerCase().includes(args.query.toLowerCase())

            return isTitleMatch || isBodyMatch
        })
    },
    comments(parent,args,{ db },info){
        return db.comments
    }
}

export {Query as default }