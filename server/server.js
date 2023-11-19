const express = require('express');

const path = require('path');
const db = require('./config/connection');

// importing apollo server
const {ApolloServer} = require("@apollo/server");
// import expressMiddleware to integrate apollo server with express , allows to mount the apollo Server middleware in an express app
const {expressMiddleware} = require("@apollo/server/express4");

const app = express();
const PORT = process.env.PORT || 3001;

const {typeDefs, resolvers} = require("./schema");
const {authenticate} = require("./utils/auth");

// create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// function to start the server 
async function startServer(){
  await server.start();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/graphql", expressMiddleware(server, {
  context: authenticate
}))


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}


db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));

});
}

startServer();