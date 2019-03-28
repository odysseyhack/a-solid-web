import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import auth from "solid-auth-client";
import Profile from "./components/stateful_components/Profile";
import Navigation from "./components/stateful_components/Navigation";
import OverviewPage from "./components/stateful_components/OverviewPage/OverviewPage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webId: undefined
    };
  }

  fetchUser() {
    auth.trackSession(session => {
      if (!session) {
        console.log("You are not logged in");
      } else {
        console.log("You are logged in... Fetching your data now");
        console.log(session);
        this.setState({
          webId: session.webId
        });
      }
    });
  }

  async login() {
    const session = await auth.currentSession();
    if (!session) {
      await auth.login("https://solid.community");
    } else {
      this.setState({
        webId: session.webID
      });
    }
  }

  async logout() {
    auth.logout().then(() => {
      this.setState({
        webId: undefined
      });
    });
  }

  componentDidMount() {
    this.fetchUser();
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navigation login={this.login.bind(this)} webId={this.state.webId} />
          <Switch>
            <Route
              path="/"
              render={() => (
                <Profile
                  webId={this.state.webId}
                  logout={this.logout.bind(this)}
                />
              )}
              exact
            />
            <Route path="/overview" render={() => <OverviewPage />} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
