import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';


type TData = {
    id: number,
    title: string,
    author: string,
    description: string,
    topic: string,
    url: string

}

// GraphQL schema
const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
        courses_by_title_sequences(title: String): [Course]
    },
    type Mutation {
        addCourse (id: Int!, title: String!, author: String!, description: String!, topic: String!, url: String ): [Course]
        updateCourseTopic(id: Int!, topic: String!): Course
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

const coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

const getCourse = function (args: TData) {
    const id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

const getCourses = function (args: TData): Array<object> {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}
// Query that takes as parameter a string of characters and returns all Courses whose title contains this string
const getByTitleSequence = function (args: TData): Array<object> {
    const coursesArray: Array<object> = []
    coursesData.map((course) => {
        if (course.title.includes(args.title)) {
            coursesArray.push(course);
        }
    });
    return coursesArray;
};

const updateCourseTopic = function ({ id, topic }: TData) {
    coursesData.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    return coursesData.filter(course => course.id === id)[0];
}

// Add a course and display the updated list of courses 
const addCourse = function ({ id, title, author, description, topic, url }: TData) {
    const newCourse = {
        id,
        title,
        author,
        description,
        topic,
        url,
    };
    coursesData.push(newCourse);
    return coursesData;
}

const root = {
    course: getCourse,
    courses: getCourses,
    courses_by_title_sequences: getByTitleSequence,
    updateCourseTopic: updateCourseTopic,
    addCourse: addCourse

};

// Create an express server and a GraphQL endpoint
const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(5000, () => console.log('Express GraphQL Server Now Running On localhost:5000/graphql'));