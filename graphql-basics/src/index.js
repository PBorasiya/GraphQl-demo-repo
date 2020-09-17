import {
    GraphQLServer
} from 'graphql-yoga'


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
            author : '1'
        },{
            id : '102',
            text : 'Second Comment',
            author : '2'
        },{
            id : '103',
            text : 'Third Comment',
            author : '3'
        },{
            id : '104',
            text : 'Fourth Comment',   
            author : '1'          
}]


const typeDefs = `
    type Query{
        me : User!
        post : Post!
        users(query : String) : [User!]!
        posts(query : String) : [Post!]!
        comments : [Comment!]!
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
    }

    type Comment{
        id : ID!
        text : String!
        author : User!
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
        Post : {
            author(parent,args,ctx,info){
                return users.find((user) => {
                    return user.id === parent.author
                })
            }
        },
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
        Comment : {
            author(parent,args,ctx,info){
                return users.find((user) =>{
                    return user.id === parent.author
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