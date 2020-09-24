const Subscription = {
   comment : {
       subscribe(parent, {postId}, {db, pubsub} ,  info){
            const post = db.posts.find((post) => postId === post.id &&  post.published)

            if(!post){
                throw new Error('Post does not exist')
            }

            return pubsub.asyncIterator(`comment ${postId}`) //comment 1,2 etc.
       }
   },
   post : {
       subscribe(parent , args , { pubsub} ,info){
           
            
        
        return pubsub.asyncIterator('post')

       }
   }
}

export { Subscription as default } 