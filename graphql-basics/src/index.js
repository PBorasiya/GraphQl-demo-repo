import {GraphQLServer} from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
import db from './db'

const resolvers = {
        Query: {
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
            users(parent, args, ctx, info) {

                if(!args.query){
                    return users
                }

                return users.filter((user) => {
                       return user.name.toLowerCase().includes(args.query.toLowerCase())
                })
            },
            
            posts(parent, args, ctx, info){
                if(!args.query){
                    return posts
                }

                return posts.filter((post) => {
                    const isTitleMatch =  post.title.toLowerCase().includes(args.query.toLowerCase())
                    const isBodyMatch =  post.body.toLowerCase().includes(args.query.toLowerCase())

                    return isTitleMatch || isBodyMatch
                })
            },
            comments(parent,args,ctx,info){
                return comments
            }
        },
        Mutation : {
            createUser(parent, args, ctx, info){
               const emailTaken = users.some((user) => user.email === args.data.email)

               if(emailTaken){
                   throw new Error('email already taken.')
               }

               const user = {
                    id : uuidv4(),
                    ...args.data
               }

               users.push(user)

               return user
            },
            deleteUser(parent, args, ctx, info){
                const userIndex = users.findIndex((user) => user.id === args.id)

                if(userIndex === -1){
                    throw new Error('User not found.')
                }

                const deletedUsers = users.splice(userIndex,1,)

                posts = posts.filter((post) => {
                    const match = post.author === args.id

                    if(match){
                        comments = comments.filter((comment) => {
                            return Comment.post !== post.id
                        })
                    }

                    comments = comments.filter((comment) => comment.author !== args.id)

                    return !match
                })

                return deletedUsers[0]
            },
            createPost(parent, args, ctx, info){
                const userExists = users.some((user) => user.id === args.data.author)

                if(!userExists){
                    throw new Error('User does not exist')
                }

                const post = {
                    id : uuidv4(),
                    ...args.data
                }

                posts.push(post)

                return post
            },
            deletePost(parent, args, ctx, info){
                const postIndex = posts.findIndex((post) => post.id === args.id)

                if(postIndex === -1){
                    throw new Error('Post does not exist.')
                }

                const deletedPosts = posts.splice(postIndex,1)

                comments = comments.filter((comment) => comment.post !== args.id)
                
                return deletedPosts[0]

            },
            createComment(parent, args, ctx, info){
                const userExists = users.some((user) => user.id === args.data.author)
                const postExists = posts.some((post) => post.id === args.data.post && post.published)

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

                comments.push(comment)

                return comment
            },
            deleteComment(parent, args, ctx, info){
                const commentIndex = comments.findIndex((comment) => comment.id === args.id)

                if(commentIndex === -1){
                    throw new Error('Comment does not exist')
                }

                const deletedComments = comments.splice(commentIndex,1)

                return deletedComments[0]
            }
        },
        //post object gets related data from the original call and is neede to make Post-> Author and Post-> comments relationship
        Post : {
            author(parent,args,ctx,info){
                return users.find((user) => {
                    return user.id === parent.author
                })
            },
            comments(parent, args, ctx, info){
                return comments.filter((comment) => {
                    return comment.post === parent.id
                })
            }
        },
        //User object gets related data from the original call and is neede to make Author-> Post and Author-> comments relationship
        User : {
            posts(parent,args,ctx,info){
                return posts.filter((post) => {
                    return post.author === parent.id
                }) 
            },

            comments(parent,args,ctx,info){
                return comments.filter((Comment) => {
                    return Comment.author == parent.id
                })
            }
        },
        //User object gets related data from the original call and is neede to make Comment-> Author and Comment-> Post relationship
        Comment : {
            author(parent,args,ctx,info){
                return users.find((user) =>{
                    return user.id === parent.author
                })
            },
            post(parent, args, ctx, info){
                return posts.find((post) => {
                    return post.id === parent.post
                })
            }
        }
}

        const server = new GraphQLServer({
            typeDefs : './src/schema.graphql',
            resolvers,
            context : {
                db
            }
        })

        server.start(() => {
            console.log('Server is running!')
        })