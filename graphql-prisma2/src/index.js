import {GraphQLServer,PubSub} from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'
import Subscription from './resolvers/Subscription'
import prisma from './prisma'

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs : './src/schema.graphql',
    resolvers : {
        Query,
        Mutation,
        User,
        Post,
        Comment,
        Subscription
    },
    context(request){
        return{
            db,
            pubsub,
            prisma,
            request
        }
    }
})

server.start(() => {
    console.log('Server is running!')
})