import React from "react";
import { withRouter } from "react-router";
import am from './App.module.css';
import { compose } from "redux";
import { initializeApp } from "./redux/app-reducer";
import { connect, Provider } from "react-redux";
import { getInitialized } from "./redux/app-selectors";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store";
import HeaderContainer from "./components/Header/HeaderContainer";
import DistributorContainer from "./components/Distributor/DistributorContainer";
import Preloader from "./components/Common/Preloader/Preloader";

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
          <DistributorContainer />
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