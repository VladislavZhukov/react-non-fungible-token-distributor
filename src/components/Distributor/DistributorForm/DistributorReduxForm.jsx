import React from "react";
import { Field, reduxForm } from "redux-form";
import {
  createField,
  Input,
  Textarea,
} from "../../Common/FormControls/FormControls";
import {
  required,
  maxLengthCreator,
} from "../../../utils/validators/validators";
import drfm from "./DistributorReduxForm.module.css";
import { connect } from "react-redux";

const maxLength400 = maxLengthCreator(400);

let DistributorForm = ({
  handleSubmit,
  generalDataNFT,
  quantityNFT,
  disadvantagedUsers,
}) => {
  return (
    <div className={drfm.distributor__reduxForm}>
      <form onSubmit={handleSubmit}>
        <div>
          <b>QUANTITY NFT ON ACCOUNT</b>
          <div className={drfm.reduxForm__quantityAllNft}>{quantityNFT}</div>
          <b>NFT FOR DISTRIBUTION:</b>
          <div>
            <Field
              name="templateId"
              component="select"
              className={drfm.reduxForm__templateId}
            >
              <option>Select NFT...</option>
              {generalDataNFT.map((gdNFT, index) => {
                return (
                  <option key={index} value={gdNFT.template_id}>
                    {`${gdNFT.template_name} (${gdNFT.NFT.length})`}
                  </option>
                );
              })}
            </Field>
          </div>
          <b>QUANTITY NFT FOR DISTRIBUTION:</b>
          {createField(
            "quantityNft",
            "write quantity NFT",
            Input,
            [required, maxLength400],
            { type: "number" },
            "",
            1,
            drfm.reduxForm__quantityNft
          )}
          <b>RECIPIENT LIST:</b>
          <div>
            {createField(
              "recipientList",
              "write new recipient: \nJoJo1.wam \nJoJo2.wam \n... \nJoJoN.wam",
              Textarea,
              [required],
              {},
              "",
              2,
              drfm.reduxForm__recipientList
            )}
          </div>
          {disadvantagedUsers.length > 0 && (
            <div className={drfm.reduxForm__disadvantagedUsers}>
              Ohhh, noooo (^･o･^)ﾉ you have users who are missing NFT
            </div>
          )}
          <button className={drfm.reduxForm__sendButton}>SEND</button>
          <div>sending one transaction costs 5.000000 WAX</div>
        </div>
      </form>
    </div>
  );
};

let DistributorReduxForm = reduxForm({
  form: "distributor",
})(DistributorForm);

DistributorReduxForm = connect((state) => ({
  initialValues: {
    recipientList: state.distributor.disadvantagedUsers
      .map((v) => v + "\r\n")
      .join(""),
    quantityNft: 1,
  },
}))(DistributorReduxForm);

export default DistributorReduxForm;
