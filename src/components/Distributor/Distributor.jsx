import React from "react";
import "react-dropdown/style.css";
import DistributorReduxForm from "./DistributorForm/DistributorReduxForm";
import dm from "./Distributor.module.css";
import Preloader from "../Common/Preloader/Preloader";
import DistributionError from "./DistributionError/DistributionError";

const Distributor = (props) => {
  const onSubmit = (formData) => {
    props.sendTransaction(
      formData.recipientList,
      formData.templateId,
      formData.quantityNft,
      props.generalDataNFT
    );
  };
  return (
    <div className={dm.distributor}>
      {props.blockingSiteControl && <div className={dm.distributor__blockControl}></div>}
      {props.dataUpdateDone && !props.dataInProcessUpdate ? (
        <div>
          <DistributorReduxForm
            onSubmit={onSubmit}
            generalDataNFT={props.generalDataNFT}
            quantityNFT={props.quantityNFT}
            disadvantagedUsers={props.disadvantagedUsers}
          />
        </div>
      ) : (
        <div className={dm.distributor__preloader}>
          <Preloader />
        </div>
      )}
      {props.errorMessage === "" ? undefined : (
        <DistributionError errorMessage={props.errorMessage} />
      )}
    </div>
  );
};

export default Distributor;
