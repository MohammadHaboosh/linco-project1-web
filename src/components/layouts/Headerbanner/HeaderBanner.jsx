import mascotImg from "../../../assets/icons/linco-logo.png";
import { headerBannerStyles } from "./HeaderBannerStyle";

const HeaderBanner = ({ title, text }) => {
  return (
    <div className={headerBannerStyles.wrapper}>
      <div className={headerBannerStyles.textContainer}>
        <h1 className={headerBannerStyles.title}>{title}</h1>
        <p className={headerBannerStyles.description}>{text}</p>
      </div>

      <div className={headerBannerStyles.imageContainer}>
        <img
          src={mascotImg}
          alt="LinCo Mascot"
          className={headerBannerStyles.image}
        />
      </div>
    </div>
  );
};

export default HeaderBanner;
