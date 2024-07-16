const express = require('express');
require('dotenv').config();
const colors = require('colors');
const connectMongoDB = require('./config/mongo_database.js');
const cors = require('cors');

// graphql
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const port = process.env.PORT || 4000;

const app = express();

connectMongoDB();

app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: process.env.NODE_ENV === 'development'
}))

app.get('/users', (req, res) => {
  res.send('Hello world');
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})