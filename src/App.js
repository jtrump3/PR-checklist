import React from 'react';
import HomePage from './components/HomePage';
import PR from "./components/PR"
import {createStore, applyMiddleware, combineReducers} from 'redux';  
import { Provider } from "react-redux";
import PRReducer from "./reducers/PRReducer"
import thunk from 'redux-thunk';
import { loadPRs } from "./actions/PRAction";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
} from 'react-router-dom';
import FileReducer from './reducers/FileReducer';
const rootReducer = combineReducers({
    PRReducer,
    FileReducer
});

function configureStore() {
  return createStore(rootReducer, applyMiddleware(thunk));
}
export const store = configureStore();
store.dispatch(loadPRs());


class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      url: "/default"
    }
  } 
  render(){ 
    return(
      <Provider store={store}>
        <Router>
            <Switch>
                <Route path="/:PRId/:prTitle" component={PR}/>
                <Route path="/" component={HomePage}/>
            </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;