# Egghead.io/Amplify Datastore

## https://aws.amazon.com/about-aws/whats-new/2019/12/introducing-amplify-datastore/

## https://egghead.io/lessons/javascript-building-offline-first-cross-platform-apps-with-expo-and-amplify-datastore

## Steps

1. `expo init offline-xp-app && cd offline-xp-app`
2. `yarn add @aws-amplify/datastore @aws-amplify/core`
3. datastore depends on net-info, `expo install @react-native-community/netinfo`

4. Initialize AmplifyApp with `npx amplify-app`

## Editing Graphql Schema

This is a messaging app.

Open [schema.graphql](./amplify/backend/api/amplifyDatasource/schema.graphql) and create a `message` schema type.

```graphql
type Message @model {
  id: ID!
  title: String!
  color: String
}
```

Amplify will introspect the schema and generate models/entities which will interface with `datastore` api.

Run `npm run amplify-modelgen` to generate models/entities for your GraphQL models.

This creates a `src/models` dir containing the models and types.

```sh
~/G/offline-xp-app ❯❯❯ ls src/models
index.d.ts  index.js    schema.d.ts schema.js
```

## Amplify Backend

Run `amplify init` in root to set up Amplify Backend in cloud on AWS.

After the project is deployed note new `src/amplify` dir and `aws-exports.js` file:

```sh
~/G/offline-xp-app ❯❯❯ ls
App.js                    assets                    package.json
README.md                 aws-exports.js            src
amplify                   babel.config.js           yarn-error.log
amplify-build-config.json node_modules              yarn.lock
app.json                  package-lock.json
~/G/offline-xp-app ❯❯❯ 
```

Deploy the API run `amplify push`.

When asked `Do you want to generate code for your newly created GraphQL API (Y/n)` answer no because we are going to use the `datastore` api.

```sh
# `amplify push` output
✔ All resources are updated in the cloud

GraphQL endpoint: https://5fpqhndw5zfitil572brwq7o6y.appsync-api.us-east-1.amazonaws.com/graphql
GraphQL API KEY: da2-gbcxu47jwjggxns53ne442rna4

~/G/offline-xp-app ❯❯❯
```

## Using the API in the App

See gist: <https://gist.github.com/dabit3/184e875c151335c00336396c99f9ef06>

