import LandingPageContent from "../features/LandingPage/LandingPage";

const LandingPage = ({ locale = "en" }) => {
  return (
    <>
      <LandingPageContent locale={locale} />
    </>
  );
};

export default LandingPage;
