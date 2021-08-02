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
  getDataInProcessUpdate,
} from "../../redux/distributor-selectors";
import {
  getNFTFromWallet,
  sendTransaction,
  setDataInProcessUpdate,
} from "../../redux/distributor-reducer";

class DistributorContainer extends React.Component {
  componentDidMount() {
    this.props.getNFTFromWallet();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {    
    let nftUpdated = true;
    if (
      this.props.dataInProcessUpdate &&
      prevProps.generalDataNFT.length !== 0
    ) {
      if (
        this.props.generalDataNFT.length === prevProps.generalDataNFT.length &&
        this.props.quantityNFT === prevProps.quantityNFT
      ) {
        for (let j = 0; j < this.props.generalDataNFT.length; j++) {
          if (
            JSON.stringify(this.props.generalDataNFT[j].NFT.sort()) ===
            JSON.stringify(prevProps.generalDataNFT[j].NFT.sort())
          ) {
            nftUpdated = false;
            break;
          }
        }
      }
    }
    if (this.props.responseTransaction !== prevProps.responseTransaction) {
      setTimeout(
        (this.props.getNFTFromWallet, this.props.setDataInProcessUpdate(true)),
        3000
      );
    } else if (
      this.props.responseTransaction === prevProps.responseTransaction &&
      this.props.dataInProcessUpdate &&
      !nftUpdated
    ) {
      setTimeout(this.props.getNFTFromWallet, 3000);
    } else if (
      this.props.responseTransaction === prevProps.responseTransaction &&
      this.props.dataInProcessUpdate &&
      nftUpdated
    ) {
      this.props.setDataInProcessUpdate(false);
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
          dataInProcessUpdate={this.props.dataInProcessUpdate}
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
    errorMessage: getErrorMessage(state),
    dataInProcessUpdate: getDataInProcessUpdate(state),
  };
};

const mapDispatchToProps = {
  getNFTFromWallet,
  sendTransaction,
  setDataInProcessUpdate,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  DistributorContainer
);
