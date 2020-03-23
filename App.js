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
  
  const container = { padding: 20, paddingTop: 80 }
  const input = { marginBottom: 10, padding: 7, backgroundColor: '#ddd' }
  const heading = { fontWeight: 'normal', fontSize: 40 }
  const messageBg = { backgroundColor: 'white' }
  const messageStyle = { padding: 20, marginTop: 7, borderRadius: 4 }
  const messageTitle = { margin: 0, padding: 9, fontSize: 20  }
  
  export default App
  