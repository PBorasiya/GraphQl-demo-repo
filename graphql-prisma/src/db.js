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
    published: true,
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

const db ={
    users,
    posts,
    comments
}

export { db as default }