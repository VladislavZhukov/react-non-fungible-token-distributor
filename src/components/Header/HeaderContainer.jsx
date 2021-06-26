import { connect } from "react-redux";
import { compose } from "redux";
import { getAuth } from "../../redux/auth-selectors";
import Header from "./Header";

const mapStateToProps = (state) => {
  return {
    auth: getAuth(state),
  };
};

const mapDispatchToProps = {};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Header);
