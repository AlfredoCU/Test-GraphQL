// Express.
const express = require("express");
const app = express();

// Graphql.
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

// Data.
const { courses } = require("./data.json");

// Un esquema define como se presentaran los datos.
const schema = buildSchema(`
    type Query {
		course(id: Int!): Course
		courses(topic: String!): [Course]
    }

	type Mutation {
		updateCourseTopic(id: Int!, topic: String!): Course
	}

	type Course {
		id: Int
		title: String
		description: String
		author: String
		topic: String
		url: String
	}
`);

// Cuando se agrega un  => ! es para indicar que es obligatorio.
// Cuando queremos agregar un array [].
// Las mutaciones nos ayudan a alterar (modificar) nuestra información.

// Queries.
const getCourse = (args) => {
	let id = args.id;
	return courses.filter((item) => item.id === id)[0];
};

const getCourses = (args) => {
	let topic = args.topic;
	return courses.filter((item) => item.topic === topic);
};

// Args es un objeto que tiene como propiedades los paramentros que le enviamos.

// Mutation.
const updateCourseTopic = ({ id, topic }) => {
	return courses
		.map((item) => (item.id === id ? { ...item, topic } : item))
		.filter((item) => item.id === id)[0];
};

// Values.
const root = {
	course: getCourse,
	courses: getCourses,
	updateCourseTopic,
};

// Route.
app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		rootValue: root,
		graphiql: true,
	})
);

// Server.
app.listen(3000, () => console.log("Server on port 3000"));
