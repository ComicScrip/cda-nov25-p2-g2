import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const uri = "http://localhost:4000/";

if (!uri) throw new Error("missing API URL, check your .env !");

console.log("GQL API URL :", uri);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: uri,
    credentials: "include", // Important: Include cookies with requests
  }),
});

export default client;
