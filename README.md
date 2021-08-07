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

## GraphQL Queries

[Instructor demo site](graphql-demo.mead.io) for graphql queries

- We will be building our own api and client

### Simple Query

```graphql
query {
	hello
	course
	courseInstructor
}
```

### Nested Query

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

## GraphQL Types

### Scalar Types

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

### Custom Types

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

Querying

```graphql
query {
	me {
		id
		name
		email
	}
}
```

## Setup

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
