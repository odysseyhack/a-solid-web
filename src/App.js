import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route , Switch} from 'react-router-dom';
import Navigation from './components/Navigation';
import Start from './components/start/Start';
import GetUser from './components/GetUser/GetUser';

class App extends React.Component {
  render() {
    let toggleModal = () => this.setState({ modalShow: !this.state.modalShow });

    return (
     <BrowserRouter>
      <div>
        <Navigation />
        <Switch>
          <Route path="/" render={() => <Start /> } exact />
          <Route path="/getuser" render= {() => <GetUser /> } exact /> 
        </Switch>
      </div>
    </BrowserRouter>  
    );
  }
}

export default App;


