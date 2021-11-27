const Query = {
	users(parent, args, { prisma }, info) {
		const opArgs = {};

		if (args.query) {
			opArgs.where = {
				OR: [
					{
						name_contains: args.query,
					},
					{
						email_contains: args.query,
					},
				],
			};
		}

		return prisma.query.users(opArgs, info);
	},
	posts(parent, args, { prisma }, info) {
		const opArgs = {};

		if (args.query) {
			opArgs.where = {
				OR: [
					{
						title_contains: args.query,
					},
					{
						body_contains: args.query,
					},
				],
			};
		}

		return prisma.query.posts(opArgs, info);
	},
	comments(parent, args, { db }, info) {
		return db.comments;
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
};

export { Query as default };
