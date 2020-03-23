# Egghead.io/Building Offline-first Cross-platform Apps with Expo and Amplify DataStore     

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

```js
import Amplify from '@aws-amplify/core'
import config from './aws-exports'
Amplify.configure(config)

import React, { useState, useEffect } from 'react'
import { Text, View, TextInput, Button } from 'react-native'
// import the datastore api
import { DataStore } from '@aws-amplify/datastore'
// import the message model
import { Message} from './src/models'

// create some initial state
// type is: `const Message: PersistentModelConstructor<any>`
const initialState = { color: 'black', title: '' }

// create app component with form state and messages

function App(){
    const [formState, updateFormState] = useState(initialState)
    const [messages, updateMessages] = useState([])

    // useEffect hook to get messages after component loads

    useEffect(() => {
      fetchMessages()
      // use an observable to subcribe to new message then unsubscribe when new message arrives
      // call `fetchMessages` again then unsubscribe.
      const subscription = DataStore.observe(Message).subscribe(() => fetchMessages())
      return () => subscription.unsubscribe()
    })
    // update form state as user types
    function onChangeText(key, value) {
      updateFormState({ ...formState, [key]: value })
    }

    // function to query datastore by calling DataStore.query and passing in
    //  the message model then call `update messages` to update the messages array
    async function fetchMessages() {
      const messages = await DataStore.query(Message)
      updateMessages(messages)
    }
    // check if formState title is not empty, if not, save with DataStore Api
    async function createMessage() {
      if (!formState.title) return
      await DataStore.save(new Message({ ...formState }))
      // clear form by returning to initial state
      updateFormState(initialState)
    } 
    
    return (
      <View style={container}>
        <Text style={heading}>Real Time Message Board</Text>
        <TextInput
          onChangeText={v => onChangeText('title', v)}
          placeholder='Message title'
          value={formState.title}
          style={input}
        />
        <TextInput
          onChangeText={v => onChangeText('color', v)}
          placeholder='Message color'
          value={formState.color}
          style={input}
          autoCapitalize='none'
        />
        <Text>Color: <Text style={{fontWeight: 'bold', color: formState.color}}>{formState.color}</Text></Text>
        <Button onPress={createMessage} title='Create Message' />
        {
          messages.map(message => (
            <View key={message.id} style={{...messageStyle, backgroundColor: message.color}}>
              <View style={messageBg}>
                <Text style={messageTitle}>{message.title}</Text>
              </View>
            </View>
          ))
        }
      </View>
    )
  }
```

## Try it

Run `expo start` and click `open in browser` and `open in simulator` to see them working together.