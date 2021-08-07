import { GraphQLServer } from 'graphql-yoga';

// Scalar Types: String, Boolean, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
    type Query {
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }    
`;

// Resolvers
const resolvers = {
	Query: {
		me() {
			return {
				id: '123098',
				name: 'Gary',
				email: 'gary@example.com',
				age: 32,
			};
		},
		post() {
			return {
				id: '123009',
				title: 'Hello',
				body: 'Hello again',
				published: true,
			};
		},
	},
};

const server = new GraphQLServer({
	typeDefs,
	resolvers,
});

server.start(() => {
	console.log('The server is up!');
});
