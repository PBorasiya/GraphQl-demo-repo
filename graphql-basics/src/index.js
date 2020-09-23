import {GraphQLServer} from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

//Demo user data

const users = [{
            id: "1",
            name: "Pranav",
            email: "example.com",
            age: 26
        }, {
            id: "2",
            name: "Vishakha",
            email: "vishoo.com",
            age: 26
        }, {
            id: "3",
            name: "Neel",
            email: "neel.com",
            age: 25
        }, {
            id: "4",
            name: "Raja",
            email: "raja.com",
            age: 21
        },{
            id: "5",
            name: "Jay",
            email: "jay.com",
            age: 23
        }]

//Demo post data

const posts = [{
            id: '1',
            title: "GraphQl 101",
            body: "Welcome to the introductory course on GraphQL",
            published: true,
            author : '1'
        },{
            id: '2',
            title: "Cricket 102",
            body: "Welcome to the advance course on Cricket",
            published: true,
            author : '1'
        },{
            id: '3',
            title: "Music 103",
            body: "Welcome to the elite course on Music",
            published: false,
            author : '2'
        },{
            id: '4',
            title: "GraphQl 104",
            body: "Welcome to the master course on GraphQL",
            published: false,
            author : '3'
        }
                ]

const comments = [{
            id : '101',
            text : 'First Comment',
            author : '1',
            post : '1'
        },{
            id : '102',
            text : 'Second Comment',
            author : '2',
            post : '2'
        },{
            id : '103',
            text : 'Third Comment',
            author : '3',
            post : '3'
        },{
            id : '104',
            text : 'Fourth Comment',   
            author : '1',
            post : '1'          
}]

//input type must only include scalar type and cannot have any object or complex type.
const typeDefs = `
    type Query{
        me : User!
        post : Post!
        users(query : String) : [User!]!
        posts(query : String) : [Post!]!
        comments : [Comment!]!
    }

    type Mutation {
        createUser( data : CreateUserInput ) : User!
        createPost( data : CreatePostInput ) : Post!
        createComment( data : CreateCommentInput ) : Comment!
    } 

    
    input CreateUserInput{
        name : String!
        email : String!
        age : Int!
    }

    input CreatePostInput{
        title : String!
        body : String!
        published : Boolean!
        author : ID!
    }

    input CreateCommentInput{
        text : String!
        author : ID!
        post : ID!
    }

    type User{
        id : ID!
        name : String!
        age : Int!
        email : String!
        posts : [Post!]!
        comments : [Comment!]!
    }

    type Post{
        id : ID!
        title : String!
        body : String!
        published : Boolean!
        author : User!
        comments : [Comment!]!
    }

    type Comment{
        id : ID!
        text : String!
        author : User!
        post : Post!
    }
`

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
            typeDefs,
            resolvers
        })

        server.start(() => {
            console.log('Server is running!')
        })