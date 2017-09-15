# Flow Navigation
## Motivation
React Navigation and similar packages work fine for navigation between 'scenes' and tabs and so forth.
However I have often lacked an inner navigation. Load in a list of components and navigate between them
smoothly in an inner flow.

NOTE! This is a work in progress.

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

## Routes

```
const routes = [{
  title: 'firstComponent'
  component: jsx component
  startPosition: -1, 0, 1
}]
```
