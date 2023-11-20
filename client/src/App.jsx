import './App.css';
import { Outlet } from 'react-router-dom';
import {ApolloClient, InMemoryCache, ApolloProvider, createHttpLink} from "@apollo/client"

import Navbar from './components/Navbar';

// creating http link
const httpLink = createHttpLink({
  uri: "http://localhost: 3001/graphql"
})

// create an Apollo client
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache
})

function App() {
  return (
    <ApolloProvider client={client}>
    <>
      <Navbar />
      <Outlet />
    </>
    </ApolloProvider>
  );
}

export default App;
