import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

// GraphQL schema
const schema1 = buildSchema(`
    type Query {
        message: String
    }
`);

// Root resolver
const root1 = {
    message: () => 'Hello World!'
};


const app1 = express();
app1.use('/graphql', graphqlHTTP({
    schema: schema1,
    rootValue: root1,
    graphiql: true,
}));
app1.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');