import hm from "./Header.module.css";

const Header = (props) => {
  return (
    <div className={hm.header}>
      <div className={hm.header__userAccountName}>
        HELLO mr: {props.auth.userAccount}
      </div>
      <div className={hm.header__generalName}>WAX DISTRIBUTOR</div>
    </div>
  );
};

export default Header;
