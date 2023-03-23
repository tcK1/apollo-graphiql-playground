import xss from 'xss'

interface ApolloServerPluginLandingPageGraphiQLPlaygroundOptions {
  url?: string
  shouldPersistHeaders?: boolean
}

const generateHtml = (
  { url = '/graphql', shouldPersistHeaders }: ApolloServerPluginLandingPageGraphiQLPlaygroundOptions = {},
) => /* HTML */`
<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="icon" type="image/png" href="https://avatars.githubusercontent.com/u/12972006?s=200&v=4"/>

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

    <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js" integrity="sha384-tMH8h3BGESGckSAVGZ82T9n90ztNXxvdwvdM6UoR56cYcf+0iGXBliJ29D+wZ/x8" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js" integrity="sha384-bm7MnzvK++ykSwVJ2tynSE5TRdN+xL418osEVF2DE/L/gfWHj91J2Sphe582B1Bh" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/graphiql@2.4.0/graphiql.min.js" integrity="sha384-MVcRONLrOPBea05C9lB5pu31zTbPkbZI/gIn2y0r5xH6GefRkJcnrBGlY4zo2nwC" crossorigin="anonymous"></script>

    <script src="https://unpkg.com/@graphiql/plugin-explorer@0.1.14/dist/graphiql-plugin-explorer.umd.js" integrity="sha384-rbN7vYh67VVbUGRkgCVTFu0Pk25KR5Ns9b6sOyPHf5GiYat1ce44UEF5I+HqE2Dg" crossorigin="anonymous"></script>

    <link rel="stylesheet" href="https://unpkg.com/graphiql/graphiql.min.css" />
  </head>

  <body>
    <div id="graphiql"></div>

    <script>
      const fetcher = GraphiQL.createFetcher({
        url: '${url}',
      })

      const props = {
        ${shouldPersistHeaders ? `shouldPersistHeaders: ${xss(shouldPersistHeaders.toString())}` : ''}
      }

      const tabState = localStorage.getItem('graphiql:tabState')

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

      const root = ReactDOM.createRoot(document.getElementById('graphiql'));
      root.render(React.createElement(GraphiQLWithPlugins));
    </script>
  </body>
</html>
`

export const ApolloServerPluginLandingPageGraphiQLPlayground = (
  options?: ApolloServerPluginLandingPageGraphiQLPlaygroundOptions,
) => {
  const html = generateHtml(options)

  return ({
    async serverWillStart() {
      return {
        async renderLandingPage() {
          return { html }
        },
      }
    },
  })
}
