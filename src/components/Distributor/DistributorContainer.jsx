//Core
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
//Component
import Distributor from "./Distributor";
//Selectors
import {
  getRecipient,
  getAllNFT,
  getAllQuantityNFT,
  getResponseTransaction,
  getDataUpdateDone,
  getErrorMessage,
  getDataInProcessUpdate,
  getDisadvantagedUsers,
  getBlockingSiteControl,
} from "../../redux/distributor-selectors";
//Reducer
import {
  getNFTFromWallet,
  sendTransaction,
  setDataInProcessUpdate,
} from "../../redux/distributor-reducer";

class DistributorContainer extends React.Component {
  componentDidMount() {
    this.props.getNFTFromWallet();
  }
  componentDidUpdate(prevProps) {
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
          debugger
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
    //* PAGE UPDATE DESCRIPTION
    if (this.props.responseTransaction !== prevProps.responseTransaction) {
      //* Update page after receiving a response about a sent transaction
      setTimeout(
        (this.props.getNFTFromWallet, this.props.setDataInProcessUpdate(true)),
        3000
      );
    } else if (
      //* Refreshes the page if the transaction was submitted 
      //* and NFT data in user's inventory was received unchanged
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
      //* sets DataInProcessUpdate flag to false
      this.props.setDataInProcessUpdate(false);
    }
  }
  render() {
    return (
      <>
        <Distributor
          recipient={this.props.recipient}
          quantityNFT={this.props.quantityNFT}
          errorMessage={this.props.errorMessage}
          dataUpdateDone={this.props.dataUpdateDone}
          generalDataNFT={this.props.generalDataNFT}
          sendTransaction={this.props.sendTransaction}
          disadvantagedUsers={this.props.disadvantagedUsers}
          dataInProcessUpdate={this.props.dataInProcessUpdate}
          blockingSiteControl={this.props.blockingSiteControl}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    recipient: getRecipient(state),
    generalDataNFT: getAllNFT(state),
    errorMessage: getErrorMessage(state),
    quantityNFT: getAllQuantityNFT(state),
    dataUpdateDone: getDataUpdateDone(state),
    disadvantagedUsers: getDisadvantagedUsers(state),
    responseTransaction: getResponseTransaction(state),
    dataInProcessUpdate: getDataInProcessUpdate(state),
    blockingSiteControl: getBlockingSiteControl(state),
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
