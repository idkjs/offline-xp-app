# https://egghead.io/lessons/javascript-building-offline-first-cross-platform-apps-with-expo-and-amplify-datastore

## Steps

1. `expo init offline-xp-app && cd offline-xp-app`
2. `yarn add @aws-amplify/datastore @aws-amplify/core`
3. datastore depends on net-info, `expo install @react-native-community/netinfo`

## Amplify App

Initialize AmplifyApp with `npx amplify-app`