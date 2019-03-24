import React from 'react';
import { BrowserRouter, Route, Switch} from "react-router-dom"
import Profile from "./components/Profile";
import Navigation from "./components/Navigation";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
      <div>
        <Navigation/>
        <Switch>
          <Route path="/" component= {Profile} exact/>
        </Switch>  
      </div>
    </BrowserRouter>
    );
  }
}

export default App;
