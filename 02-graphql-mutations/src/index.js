import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

// Scalar Types: String, Boolean, Int, Float, ID

// Demo User data
let users = [
	{
		id: '1',
		name: 'Gary',
		email: 'gary@example.com',
		age: 32,
	},
	{
		id: '2',
		name: 'Sarah',
		email: 'sarah@example.com',
	},
	{
		id: '3',
		name: 'Mike',
		email: 'mike@example.com',
	},
];

// Demo Post data
let posts = [
	{
		id: '1',
		title: 'Test 1',
		body: 'Test Body 1',
		published: true,
		author: '1',
	},
	{
		id: '2',
		title: 'Test 2',
		body: 'Test Body 2',
		published: false,
		author: '1',
	},
	{
		id: '3',
		title: 'Test 3',
		body: 'Test Body 3',
		published: true,
		author: '2',
	},
];

// Demo Comment data
let comments = [
	{
		id: '1',
		text: 'Comment 1',
		author: '1',
		post: '1',
	},
	{
		id: '2',
		text: 'Comment 2',
		author: '1',
		post: '1',
	},
	{
		id: '3',
		text: 'Comment 3',
		author: '2',
		post: '2',
	},
	{
		id: '4',
		text: 'Comment 4',
		author: '3',
		post: '3',
	},
];

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }

    type Mutation {
        createUser(input: CreateUserInput!): User!
		deleteUser(id: ID!): User!
		createPost(input: CreatePostInput!): Post!
		createComment(input: CreateCommentInput!): Comment!
    }

	input CreateUserInput {
		name: String!
		email: String!
		age: Int
	}

	input CreatePostInput {
		title: String!
		body: String!
		published: Boolean!
		author: ID!
	}

	input CreateCommentInput {
		text: String!
		author: ID!
		post: ID!
	}
`;

// Resolvers
const resolvers = {
	Query: {
		users(parent, args, ctx, info) {
			if (!args.query) {
				return users;
			}

			return users.filter((user) => {
				return user.name.toLowerCase().includes(args.query.toLowerCase());
			});
		},
		posts(parent, args, ctx, info) {
			if (!args.query) {
				return posts;
			}

			return posts.filter((post) => {
				const isTitleMatch = post.title
					.toLowerCase()
					.includes(args.query.toLowerCase());
				const isBodyMatch = post.body
					.toLowerCase()
					.includes(args.query.toLowerCase());

				return isTitleMatch || isBodyMatch;
			});
		},
		comments(parent, args, ctx, info) {
			return comments;
		},
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
	Post: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author;
			});
		},
		comments(parent, args, ctx, info) {
			return comments.filter((comment) => {
				return comment.post === parent.id;
			});
		},
	},
	User: {
		posts(parent, args, ctx, info) {
			return posts.filter((post) => {
				return post.author === parent.id;
			});
		},
		comments(parent, args, ctx, info) {
			return comments.filter((comment) => {
				return comment.author === parent.id;
			});
		},
	},
	Comment: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author;
			});
		},
		post(parent, args, ctx, info) {
			return posts.find((post) => {
				return post.id === parent.post;
			});
		},
	},
	Mutation: {
		createUser(parent, args, ctx, info) {
			const emailTaken = users.some((user) => {
				return user.email === args.input.email;
			});

			if (emailTaken) {
				throw new Error('Email taken');
			}

			const user = {
				id: uuidv4(),
				...args.input,
			};

			users.push(user);

			return user;
		},
		deleteUser(parent, args, ctx, info) {
			const userIndex = users.findIndex((user) => user.id === args.id);

			if (userIndex === -1) {
				throw new Error('User not found');
			}

			const deletedUsers = users.splice(userIndex, 1);

			posts = posts.filter((post) => {
				const match = post.author === args.id;

				if (match) {
					comments = comments.filter((comment) => comment.post !== post.id);
				}

				return !match;
			});

			comments = comments.filter((comment) => comment.author !== args.id);

			return deletedUsers[0];
		},
		createPost(parent, args, ctx, info) {
			const userExists = users.some((user) => {
				return user.id === args.input.author;
			});

			if (!userExists) {
				throw new Error('User not found');
			}

			const post = {
				id: uuidv4(),
				...args.input,
			};

			posts.push(post);

			return post;
		},
		createComment(parent, args, ctx, info) {
			const userExists = users.some((user) => {
				return user.id === args.input.author;
			});
			const postExits = posts.some((post) => {
				return post.id === args.input.post && post.published;
			});

			if (!userExists) {
				throw new Error('User not found');
			}

			if (!postExits) {
				throw new Error('Post not found');
			}

			const comment = {
				id: uuidv4(),
				...args.input,
			};

			comments.push(comment);

			return comment;
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
