import xss from 'xss'

interface PluginGraphiQLPlaygroundOptions {
  url?: string
  shouldPersistHeaders?: boolean
}

const generateHtml = ({ url = '/graphql', shouldPersistHeaders }: PluginGraphiQLPlaygroundOptions = {}) => /* HTML */`
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

    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/graphiql/graphiql.min.js"></script>


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


      const root = ReactDOM.createRoot(document.getElementById('graphiql'));
      root.render(
        React.createElement(GraphiQL, {
          fetcher,
          defaultEditorToolsVisibility: true,
          ...props
        }),
      );
    </script>
  </body>
</html>
`

export const PluginGraphiQLPlayground = (options?: PluginGraphiQLPlaygroundOptions) => {
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
