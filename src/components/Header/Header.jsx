import hm from "./Header.module.css";
import telegramLogo from "../../assets/images/telegram_logo_blue.png";
import { Link } from "react-router-dom";

const Header = (props) => {
  return (
    <div className={hm.header}>
      <div className={hm.header__userAccountName}>
        HELLO mr: {props.auth.userAccount}
      </div>
      <div className={hm.header__generalName}>WAX NFT DISTRIBUTOR</div>
      <div className={hm.header__telegramLogo}>
        <a href="https://t.me/joinchat/irOWjM7DHFljYTMy">
          <img
            className={hm.header__telegramLogo_image}
            src={telegramLogo}
            alt={"logo"}
          />
        </a>
      </div>
    </div>
  );
};

export default Header;
