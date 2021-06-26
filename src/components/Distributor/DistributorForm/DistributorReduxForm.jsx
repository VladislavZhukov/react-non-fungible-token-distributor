import React from "react";
import { Field, reduxForm } from "redux-form";
import {
  createField,
  Input,
  Textarea,
} from "../../Common/FormControls/FormControls";
import { required } from "../../../utils/validators/validators";
import drfm from "./DistributorReduxForm.module.css";

const DistributorForm = ({ handleSubmit, generalDataNFT, quantityNFT }) => {
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
            [required],
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
          <button className={drfm.reduxForm__sendButton}>SEND</button>
        </div>
      </form>
    </div>
  );
};

const DistributorReduxForm = reduxForm({
  form: "distributor",
  initialValues: {
    quantityNft: 1,
  },
})(DistributorForm);

export default DistributorReduxForm;
