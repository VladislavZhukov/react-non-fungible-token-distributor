//Core
import React from "react";
import am from './App.module.css';
import { withRouter } from "react-router";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { connect, Provider } from "react-redux";
import { compose } from "redux";
import store from "./redux/store";
//Reducer
import { initializeApp } from "./redux/app-reducer";
//Selector
import { getInitialized } from "./redux/app-selectors";
//Common
import Preloader from "./components/Common/Preloader/Preloader";
//Component
import HeaderContainer from "./components/Header/HeaderContainer";
import DistributorContainer from "./components/Distributor/DistributorContainer";

class App extends React.Component {
  componentDidMount() {
    this.props.initializeApp();
  }
  render() {
    if (!this.props.initialized) return (
      <div className={am.appWrapper__preloaderParent}>
        <div className={am.appWrapper__preloaderBlock} >
          <Preloader />
        </div>
      </div>
    )
    return (
      <div className={am.appWrapper}>
        <HeaderContainer />
        <div>
          <Switch>
            <Route exact path="/" render={() => <Redirect to={"/distributor"} />} />
            <Route path="/distributor" component={DistributorContainer} />
            <Route path="*" render={() => <Redirect to={"/distributor"} />} />
          </Switch>
        </div>
      </div>
    );
  }
};
const mapStateToProps = (state) => ({
  initialized: getInitialized(state)
});

const mapDispatchToProps = {
  initializeApp
};

const AppContainer = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps))
  (App);

const AppWaxWorker = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AppContainer />
      </Provider>
    </BrowserRouter>)
}

export default AppWaxWorker;