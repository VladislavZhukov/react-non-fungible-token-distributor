import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import Distributor from "./Distributor";
import {
  getRecipient,
  getAllNFT,
  getAllQuantityNFT,
  getResponseTransaction,
  getDataUpdateDone,
  getErrorMessage,
} from "../../redux/distributor-selectors";
import {
  getNFTFromWallet,
  sendTransaction,
} from "../../redux/distributor-reducer";

class DistributorContainer extends React.Component {
  componentDidMount() {
    this.props.getNFTFromWallet();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    //responseTransaction
    if (this.props.responseTransaction !== prevProps.responseTransaction) {
      setTimeout(this.props.getNFTFromWallet, 3000);
    }
  }
  render() {
    return (
      <>
        <Distributor
          generalDataNFT={this.props.generalDataNFT}
          recipient={this.props.recipient}
          sendTransaction={this.props.sendTransaction}
          quantityNFT={this.props.quantityNFT}
          dataUpdateDone={this.props.dataUpdateDone}
          errorMessage={this.props.errorMessage}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    quantityNFT: getAllQuantityNFT(state),
    generalDataNFT: getAllNFT(state),
    recipient: getRecipient(state),
    responseTransaction: getResponseTransaction(state),
    dataUpdateDone: getDataUpdateDone(state),
    errorMessage: getErrorMessage(state)
  };
};

const mapDispatchToProps = {
  getNFTFromWallet,
  sendTransaction,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  DistributorContainer
);
