import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { PluginGraphiQLPlayground } from 'apollo-graphiql-playground'

const typeDefs = /* GraphQL */`
  type Book {
    title: String
    author: String
  }

  type Query {
    books(x: String): [Book]
  }
`

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
]

const resolvers = {
  Query: {
    books: () => books,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [PluginGraphiQLPlayground({ shouldPersistHeaders: true })],
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
})

// eslint-disable-next-line no-console
console.log(`🚀  Server ready at: ${url}`)
