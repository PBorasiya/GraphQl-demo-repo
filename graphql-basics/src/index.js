import { GraphQLServer} from 'graphql-yoga'

const typeDefs = `
    type Query{
        id : ID!
        name : String!
        age : Int!
        employed : Boolean!
        gpa : Float!
        title : String!
        price : Float!
        releaseYear :Int
        rating : Float
        inStock : Boolean!
    }
`

const resolvers = {
    Query : {
       id(){
           return 'abc1234'
       },
       name(){
           return 'Pranav Borasiya'
       },
       age(){
           return 26
       },
       employed(){
           return true
       },
       gpa(){
            return 3.26
       },
       title(){
           return 'Pranav is the best product'
       },
       price(){
           return 150000.50
       },
       releaseYear(){
           return 2018
       },
       rating(){
           return 5
       },
       inStock(){
            return true
       }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() =>{
    console.log('Server is running!')
})