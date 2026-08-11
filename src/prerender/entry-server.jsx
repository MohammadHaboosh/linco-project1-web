import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import LandingPage from "../features/LandingPage/LandingPage.jsx";

export const renderLanding = (locale) =>
  renderToString(
    <StaticRouter location={locale === "ar" ? "/ar" : "/"}>
      <LandingPage locale={locale} />
    </StaticRouter>,
  );
