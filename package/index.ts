import xss from 'xss'

interface ApolloServerPluginLandingPageGraphiQLPlaygroundOptions {
  url?: string
  shouldPersistHeaders?: boolean
}

const generateHtml = ({
  url = '/graphql',
  shouldPersistHeaders,
}: ApolloServerPluginLandingPageGraphiQLPlaygroundOptions = {}) => /* HTML */ `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <link
        rel="icon"
        type="image/png"
        href="https://avatars.githubusercontent.com/u/12972006?s=200&v=4"
        crossorigin="anonymous"
      />

      <title>GraphiQL</title>
      <style>
        body {
          --color-base: 219, 29%, 18%;

          height: 100%;
          margin: 0;
          width: 100%;
          overflow: hidden;
          background-color: hsl(var(--color-base));
        }

        #graphiql {
          height: 100vh;
        }
      </style>

      <script
        src="https://www.unpkg.com/react@18.3.1/umd/react.production.min.js"
        integrity="sha384-DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z"
        crossorigin="anonymous"
      ></script>
      <script
        src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"
        integrity="sha384-gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1"
        crossorigin="anonymous"
      ></script>
      
      <script
        src="https://unpkg.com/graphiql@3.0.0/graphiql.min.js"
        integrity="sha384-Eqxb3y1DI7Ndw2RMd4uMbXrtm6NoEW7ru9Y0D8xr+MEPgEZm74pT38DWgdoLlVNx"
        crossorigin="anonymous"
      ></script>
      <script
        src="https://unpkg.com/@graphiql/plugin-explorer@0.1.22/dist/graphiql-plugin-explorer.umd.js"
        integrity="sha384-/GQApcxg97zfzCHB4gfpRYA2IsCsOPiKF7s9otGrc61JmIa2/5JnZdCCnvlx5RI4"
        crossorigin="anonymous"
      ></script>

      <link
        rel="stylesheet"
        href="https://unpkg.com/graphiql@3.0.0/graphiql.min.css"
        crossorigin="anonymous"
      />
    </head>

    <body>
      <div id="graphiql"></div>

      <script>
        const fetcher = GraphiQL.createFetcher({
          url: "${url}",
        });

        const props = {
          ${shouldPersistHeaders
            ? `shouldPersistHeaders: ${xss(shouldPersistHeaders.toString())}`
            : ''},
        };

        const tabState = localStorage.getItem("graphiql:tabState");

        if (tabState) {
          const { tabs, activeTabIndex } = JSON.parse(tabState);

          props.query = tabs[activeTabIndex].query;
          props.headers = tabs[activeTabIndex].headers;
          props.variables = tabs[activeTabIndex].variables;
        }

        function GraphiQLWithPlugins() {
          var [query, setQuery] = React.useState(props.query);

          var explorerPlugin = GraphiQLPluginExplorer.useExplorerPlugin({
            query: query,
            onEdit: setQuery,
          });

          return React.createElement(GraphiQL, {
            fetcher,
            defaultEditorToolsVisibility: true,
            ...props,
            plugins: [explorerPlugin],
            query: query,
            onEditQuery: setQuery,
          });
        }

        const root = ReactDOM.createRoot(document.getElementById("graphiql"));
        root.render(React.createElement(GraphiQLWithPlugins));
      </script>
    </body>
  </html>
`

export const ApolloServerPluginLandingPageGraphiQLPlayground = (
  options?: ApolloServerPluginLandingPageGraphiQLPlaygroundOptions,
) => {
  const html = generateHtml(options)

  return {
    async serverWillStart() {
      return {
        async renderLandingPage() {
          return { html }
        },
      }
    },
  }
}
