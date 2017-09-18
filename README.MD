# Flow Navigation
## Motivation/Concept
React Navigation and similar packages work fine for navigation between 'scenes' and tabs and so forth.
However I have often lacked a straight forward 'flow'. Creating a dynamic form where different components slide in depending on users previous input has been choppy and resource intensive. You have to load all components in the beginning for the best user experience. Flow Navigation is designed with three navigation options, `NEXT`, `BACK`, `INJECT`.

A initial routes or collection of components is loaded in the beginning. These are the views that will be displayed no matter what the user inputs. Use `NEXT`, `BACK` to navigate forwards and back between the components. The components are animated in and out smoothly. Whenever there is need for a diversion from the initial routes `INJECT` is used to inject a new component into the routes. The user will not notice any diversion from the 'flow' and a dynamic form is displayed as a linear process. Only the components actually used by this particular user is actually loaded.

NOTE! This is a work in progress.

## Requirements

This is a react-native package. It is designed to be used with redux. It can be adapted to be used with react, however the components used for the animations are react-native based.

## Integration
Flow Navigation requires a redux infrastructure.

```
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux'
import { flowNavigationReducer } from 'flow-navigation';

const combinedReducers = combinedReducers({
  ...otherReducers,
  flow: flowNavigationReducer,
});

const store = createStore(combinedReducers)

export default function AppContainer() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}
```

The redux state needs to be initialized with at least one route. The routes are arranged in an array of route objects. Each route object needs to contain, Title, Component, startPosition, and currentPosition.

(NOTE: Working on removing the need for startPosition, currentPosition in routes.)

```
import React, { Component } from 'react'
import { flowInitalize } from 'flowNavigation'
import { connect } from 'react-redux'

import MyComponent from './myComponent'
import NextComponent from './nextComponent'

// Longer routes should be placed in separate routes file.
const MyRoutes = [
  {
    title: 'My Component',
    ContentComponent: MyComponent,
    startPosition: 0,
    currentPosition: 0,
  },
  {
    title: 'Next Component',
    ContentComponent: NextComponent,
    startPosition: 1,
    currentPosition: 1,
  }
]

class MyClass extends Component {
  constructor(props) {
    super(props)
    props.flowInitalize(MyRoutes)
  }
  ...
  ...
}

const mapDispatchToProps = {
  flowInitalize,
}
const mapStateToProps = state => {
  ...
  ...
}
export default connect(mapStateToProps, mapDispatchToProps)(MyClass)
```

Next we need to add the main component which will actually hold the components.

```
import React, { Component } from 'react'
import FlowNavigation from 'flow-navigation'
import { Dimensions, Text, View } from 'react-native'
import { connect } from 'react-redux'

// Get window width for animations to work
const { width } = Dimensions.get('window')

const Mainflow = ({ currentRoute, routes }) => {
  <View style={{ flex: 1 }}>
    <View style={{ flex: 1}}>
      <Text>{ currentRoute.title }</Text>
    </View>
    <View style={{ flex: 4}}>
      <FlowNavigation routes={routes} screenWidth={width} />
    </View>
  </View>
}

const mapDispatchToProps = {

}

const mapStateToProps = (state) => {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(MainFlow)

```
