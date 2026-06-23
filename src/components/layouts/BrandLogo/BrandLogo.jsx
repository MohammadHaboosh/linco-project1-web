import { logoStyles } from "./BrandLogoStyles";
import logoImg from "../../../../public/images/linco-logo.jpg";

const BrandLogo = () => {
  return (
    <div className={logoStyles.container}>
      <div className={logoStyles.imageWrapper}>
        <img
          src={logoImg}
          alt="LinCo Corporate Squid Logo"
          className={logoStyles.image}
        />
      </div>
      <span className={logoStyles.brandText}>
        LinCo <span className={logoStyles.brandSubtext}>Link Company.</span>
      </span>
    </div>
  );
};

export default BrandLogo;
