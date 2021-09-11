# GraphQL

1. GraphQL = Graph Query Language
1. Any client (web, mobile, server), any language, any database
1. Because you write your query on the client, the client controls what data you get
   - Not the server
   - With a rest api, it is the server that determines what is returned
1. Fewer http requests
   - Flexible data querying
   - Less code to manage...
1. GraphQL is self documenting

[GraphQL Specification](http://spec.graphql.org/)

## What is a Graph

![](images/graph.png)

# Setup

1. Install [babel](https://babeljs.io/)
   - Javascript compiler
   - Allows use of modern js, but allows code to run in all browsers
   ```
   npm install babel-cli babel-preset-env
   ```
   - Create a .babelrc config file
   ```
   {
       "presets": [
           "env"
       ]
   }
   ```
1. Install graphql-yoga
   ```
   npm install graphql-yoga
   ```
   - [Documentation](https://github.com/dotansimha/graphql-yoga)
   - This package is fully featured, and easy to use
   - The sweet 'playground' is a feature of graphql-yoga
1. Live Reload for GraphQL-Yoga
   - Using nodemon
   ```
   npm install nodemon --save-dev
   ```
1. Install GraphQL extension
   - Allows us to create .graphql files
   - Syntax highlighting, intellisense, etc...

# GraphQL Queries

[Instructor demo site](graphql-demo.mead.io) for graphql queries

- We will be building our own api and client

## Simple Query

```graphql
query {
	hello
	course
	courseInstructor
}
```

## Nested Query

An object

```graphql
query {
	hello
	course
	courseInstructor
	me {
		id
		name
		email
	}
}
```

An array of values

```graphql
query {
	users {
		name
		email
	}
}
```

# GraphQL Types

## Scalar Types

1. String
1. Boolean
1. Int
1. Float
1. ID

```js
const typeDefs = `
    type Query {
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`;

// Resolvers
const resolvers = {
	Query: {
		title() {
			return 'The War of Art';
		},
		price() {
			return 12.99;
		},
		releaseYear() {
			return;
		},
		rating() {
			return 5;
		},
		inStock() {
			return true;
		},
	},
};
```

## Custom Types

1. Structured similarly to the Query
1. You define the properties the type should have

```js
const typeDefs = `
    type Query {
        me: User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
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
	},
};
```

```graphql
query {
	me {
		id
		name
		email
	}
}
```

# Operation Arguments

- This allows us to create a query that takes in arguments

```js
const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        add(a: Float!, b: Float!): Float!
    }  
`;

const resolvers = {
	Query: {
		greeting(parent, args, ctx, info) {
			if (args.name && args.position) {
				return `Hello, ${args.name} you are my favorite ${args.position}`;
			}

			return 'Hello';
		},
		add(parent, args, ctx, info) {
			return args.a + args.b;
		},
	},
};
```

- Notice that we have a bunch of arguments in the resolver function
- Even if you don't use them all, it's a good habit to include all of them

```graphql
query {
	greeting(name: "Gary", position: "Programmer")
	add(a: 12, b: 12)
}
```

# Arrays

## Scalar Types

```js
const typeDefs = `
    type Query {
        add(numbers: [Float!]!): Float!
        grades: [Int!]!
    }  
`;

const resolvers = {
	Query: {
		add(parent, args, ctx, info) {
			if (args.numbers.length === 0) {
				return 0;
			}

			return args.numbers.reduce((acc, cur) => {
				return acc + cur;
			});
		},
		grades(parent, args, ctx, info) {
			return [99, 80, 93];
		},
	},
};
```

```graphql
query {
	grades
	add(numbers: [1, 2, 3, 4])
}
```

## Custom Types

```js
const typeDefs = `
    type Query {
        users(query: String): [User!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }  
`;

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
	},
};
```

```graphql
query {
	users(query: "A") {
		id
		name
		email
		age
	}
}
```

# Relational Data and Queries

1. With relational data, we are linking two User defined types together
1. The big takeaway is that we develop resolvers for our user defined types that will then return the child relationship
   - Post resolver will return a User that wrote the post
   - User resolver will return all the Posts a user wrote
1. It builds off of what is defined in the Query resolver
   - This resolver will be considered the 'parent'
   - So, the Query resolver returns a 'users' function (all Users)
   - The User resolver will then allow us to query for posts
1. Putting it all together will result in queries that look like this:
   ```graphql
   query {
   	users {
   		id
   		name
   		email
   		age
   		posts {
   			id
   			title
   			comments {
   				text
   			}
   		}
   	}
   }
   ```
   - Relationally, a user has posts, posts have comments
   - In this case, we could even query for a post in the comments!
1. Worth noting, GraphQL relationships don't necessarily match database ones!
   - We add a List of Comments to a Post for GraphQL
   - Post Id on the Comment table relationally

## Basics

- We are linking a Post to an Author
  - Adding an author field to Post
- The idea is that a post will have a user id field
  - In the db
- We create a resolver function (similar to Query)
  - This will return our user when we query a Post

```js
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
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
        author: User!
    }
`;

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
	},
	Post: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author;
			});
		},
	},
};
```

```graphql
query {
	posts {
		id
		title
		body
		published
		author {
			name
		}
	}
}
```

- As you can see, it builds on the Query resolver
- The posts() in the query resolver is the 'parent' parameter

## Arrays

- Really a one to many relationship
- Added the `posts: [Post!]!`
- Doing an array filter instead of an array find
  - Instead of expecting one result, we expect 1 to many

```js
// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
`;

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
	},
	User: {
		posts(parent, args, ctx, info) {
			return posts.filter((post) => {
				return post.author === parent.id;
			});
		},
	},
};
```

```graphql
query {
	users {
		id
		name
		email
		age
		posts {
			id
			title
		}
	}
}
```

# Mutations (Insert, Delete, Update)

1. In order to create data, we need a package to generate ids

   - [uuid](https://www.npmjs.com/package/uuid)

   ```
   npm install uuid
   ```

1. In general, mutations work similarly to query in design and function

## Insert

```js
const typeDefs = `
    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
`;

const resolvers = {
	Mutation: {
		createUser(parent, args, ctc, info) {
			const emailTaken = users.some((user) => {
				return user.email === args.email;
			});

			if (emailTaken) {
				throw new Error('Email taken');
			}

			const user = {
				id: uuidv4(),
				name: args.name,
				email: args.email,
				age: args.age,
			};

			users.push(user);

			return user;
		},
	},
};
```

```graphql
mutation {
	createUser(name: "Gary", email: "test@test.com") {
		id
		name
		email
		age
	}
}
```

### Object Spread Operator

1. We will be using a module for this
   - [babel-plugin-transform-object-rest-spread](https://www.npmjs.com/package/babel-plugin-transform-object-rest-spread)
   ```
   npm babel-plugin-transform-object-rest-spread
   ```
1. Setup plugins in .babelrc
   ```
   {
     "presets": ["env"],
     "plugins": ["transform-object-rest-spread"]
   }
   ```
1. Use the spread operator
   - Old
   ```js
   const user = {
   	id: uuidv4(),
   	name: args.name,
   	email: args.email,
   	age: args.age,
   };
   ```
   - New
   ```js
   const user = {
   	id: uuidv4(),
   	...args,
   };
   ```

## The Input Type

1. Mutations tend to have lots of inputs
   ```graphql
   type Mutation {
   	createUser(name: String!, email: String!, age: Int): User!
   	createPost(
   		title: String!
   		body: String!
   		published: Boolean!
   		author: ID!
   	): Post!
   	createComment(text: String!, author: ID!, post: ID!): Comment!
   }
   ```
1. We can define our own input types

   ```graphql
   type Mutation {
   	createUser(input: CreateUserInput!): User!
   }

   input CreateUserInput {
   	name: String!
   	email: String!
   	age: Int
   }
   ```
