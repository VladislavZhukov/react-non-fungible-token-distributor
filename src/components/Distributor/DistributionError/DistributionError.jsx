import dem from "./DistributionError.module.css";
import React from "react";

const DistributionError = ({ errorMessage }) => {
  return <div className={dem.distributor__errorMessage}>{errorMessage}</div>;
};

export default DistributionError;
