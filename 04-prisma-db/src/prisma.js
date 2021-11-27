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

// ASYNC/AWAIT

const createPostForUser = async (authorId, data) => {
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
		'{ id }'
	);

	const user = await prisma.query.user(
		{
			where: {
				id: authorId,
			},
		},
		'{ id name email posts { id title published } }'
	);

	return user;
};

// createPostForUser('ckwh11j6600kj0995jqewc3yf', {
// 	title: 'Great books to read',
// 	body: 'The War of Art',
// 	published: true,
// }).then((user) => {
// 	console.log(JSON.stringify(user, undefined, 2));
// });

const updatePostForUser = async (postId, data) => {
	const post = await prisma.mutation.updatePost(
		{
			where: {
				id: postId,
			},
			data,
		},
		'{ author { id } }'
	);

	const user = await prisma.query.user(
		{
			where: {
				id: post.author.id,
			},
		},
		'{ id name email posts { id title published } }'
	);

	return user;
};

// updatePostForUser('ckwh149qc00kp0995r04ln44d', { published: false }).then(
// 	(user) => {
// 		console.log(JSON.stringify(user, undefined, 2));
// 	}
// );
