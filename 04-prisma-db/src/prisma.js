import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
	typeDefs: 'src/generated/prisma.graphql',
	endpoint: 'http://localhost:4466',
});

// QUERIES

// prisma.query.users(null, '{ id name posts { id title } }').then((data) => {
// 	console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.query.comments(null, '{ id text author { id name } }').then((data) => {
// 	console.log(JSON.stringify(data, undefined, 2));
// });

// MUTATIONS

// CREATE

// prisma.mutation
// 	.createPost(
// 		{
// 			data: {
// 				title: 'GraphQL 101',
// 				body: '',
// 				published: false,
// 				author: {
// 					connect: {
// 						id: 'ckwgtc90j00eq0995aii2ggm1',
// 					},
// 				},
// 			},
// 		},
// 		'{ id title body published }'
// 	)
// 	.then((data) => {
// 		console.log(data);
// 		return prisma.query.users(null, '{ id name posts { id title } }');
// 	})
// 	.then((data) => {
// 		console.log(JSON.stringify(data, undefined, 2));
// 	});

// UPDATE

// prisma.mutation
// 	.updatePost(
// 		{
// 			where: {
// 				id: 'ckwh036f100jl09954vl5rhy7',
// 			},
// 			data: {
// 				body: 'This is how to get started with Graphql...',
// 				published: true,
// 			},
// 		},
// 		'{ id }'
// 	)
// 	.then((data) => {
// 		return prisma.query.posts(null, '{ id title body published }');
// 	})
// 	.then((data) => {
// 		console.log(data);
// 	});

// IF EXISTS

// prisma.exists
// 	.Comment({
// 		id: 'ckwgtfseo00h40995i0r5ntdw',
// 		author: {
// 			id: 'ckwgtc90j00eq0995aii2ggm1',
// 		},
// 	})
// 	.then((exists) => {
// 		console.log(exists);
// 	});

// ASYNC/AWAIT

const createPostForUser = async (authorId, data) => {
	const userExists = await prisma.exists.User({ id: authorId });

	if (!userExists) {
		throw new Error('User not found');
	}

	const post = await prisma.mutation.createPost(
		{
			data: {
				...data,
				author: {
					connect: {
						id: authorId,
					},
				},
			},
		},
		'{ author { id name email posts { id title published } } }'
	);

	return post.author;
};

// createPostForUser('ckwgsqhtv00700995osivaug0', {
// 	title: 'Great books to read',
// 	body: 'The Lord of the Rings',
// 	published: true,
// })
// 	.then((user) => {
// 		console.log(JSON.stringify(user, undefined, 2));
// 	})
// 	.catch((err) => {
// 		console.log(err.message);
// 	});

const updatePostForUser = async (postId, data) => {
	const postExists = await prisma.exists.Post({
		id: postId,
	});

	if (!postExists) {
		throw new Error('Post not found');
	}

	const post = await prisma.mutation.updatePost(
		{
			where: {
				id: postId,
			},
			data,
		},
		'{ author { id name email posts { id title published } } }'
	);

	return post.author;
};

// updatePostForUser('abx123', { published: false })
// 	.then((user) => {
// 		console.log(JSON.stringify(user, undefined, 2));
// 	})
// 	.catch((err) => {
// 		console.log(err.message);
// 	});
