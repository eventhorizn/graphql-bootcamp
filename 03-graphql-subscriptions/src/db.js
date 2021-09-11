const users = [
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

const posts = [
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

const comments = [
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

const db = {
	users,
	posts,
	comments,
};

export { db as default };
