# `apollo-graphiql-playground`

[![npm](https://img.shields.io/npm/v/apollo-graphiql-playground)](https://www.npmjs.com/package/apollo-graphiql-playground)

Plugin for using [GraphiQL](https://github.com/graphql/graphiql) playground inside an [Apollo Server](https://github.com/apollographql/apollo-server).

## Example

```ts
import { ApolloServerPluginLandingPageGraphiQLPlayground } from 'apollo-graphiql-playground'

const server = new ApolloServer({
  plugins: [
    ApolloServerPluginLandingPageGraphiQLPlayground({
      shouldPersistHeaders: true,
    })
  ],
})
```

### Options

- `url?` (default: `/graphql`): Which URL should the playground should use.
- `shouldPersistHeaders?`: Toggles if the contents of the headers editor are persisted in storage.


