import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
	typeDefs: 'src/generated/prisma.graphql',
	endpoint: 'http://localhost:4466',
});

// QUERY

// prisma.query.users(null, '{ id name posts { id title } }').then((data) => {
// 	console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.query.comments(null, '{ id text author { id name } }').then((data) => {
// 	console.log(JSON.stringify(data, undefined, 2));
// });

// MUTATION

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

prisma.mutation
	.updatePost(
		{
			where: {
				id: 'ckwh036f100jl09954vl5rhy7',
			},
			data: {
				body: 'This is how to get started with Graphql...',
				published: true,
			},
		},
		'{ id }'
	)
	.then((data) => {
		return prisma.query.posts(null, '{ id title body published }');
	})
	.then((data) => {
		console.log(data);
	});
