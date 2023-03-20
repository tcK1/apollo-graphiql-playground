const fetchUrl = "/graphql";

const html = /* HTML */`
<!--
 *  Copyright (c) 2021 GraphQL Contributors
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
-->
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

    <!--
      This GraphiQL example depends on Promise and fetch, which are available in
      modern browsers, but can be "polyfilled" for older browsers.
      GraphiQL itself depends on React DOM.
      If you do not want to rely on a CDN, you can host these files locally or
      include them directly in your favored resource bundler.
    -->
    <script
      src="https://unpkg.com/react@18/umd/react.development.js"
    ></script>
    <script
      src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"
    ></script>

    <!--
      These two files can be found in the npm module, however you may wish to
      copy them directly into your environment, or perhaps include them in your
      favored resource bundler.
     -->
    <link rel="stylesheet" href="https://unpkg.com/graphiql/graphiql.min.css" />
  </head>

  <body>
    <div id="graphiql"></div>
    <script
      src="https://unpkg.com/graphiql/graphiql.min.js"
    ></script>
    <script>
      const fetcher = GraphiQL.createFetcher({
        url: '${fetchUrl}',
      })

      const props = {}

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
`;

export const GraphiQLPlugin = () => {
  return({
  async serverWillStart() {
    return {
      async renderLandingPage() {
        return { html };
      },
    };
  },
})};

