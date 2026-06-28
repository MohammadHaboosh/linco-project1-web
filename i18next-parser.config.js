export default {
  createOldCatalogs: false,
  locales: ["en", "ar"],
  output: "src/locales/$LOCALE/translation.json",
  input: ["src/**/*.{js,jsx}"],
  defaultNamespace: "translation",
  defaultValue: function (locale, namespace, key) {
    if (locale === "en") {
      return key;
    }
    return "";
  },
};
