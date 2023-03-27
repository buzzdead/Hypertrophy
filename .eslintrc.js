module.exports = {
  plugins: ["unused-imports"],
  root: true,
  extends: ["@react-native-community", "plugin:unused-imports/recommended"],
  rules: {
    "unused-imports/no-unused-imports": "warn",
    quotes: ["error", "double"],
    "max-len": ["error", {code: 120}],
    "unused-imports/no-unused-vars": ["warn", {vars: "all", args: "after-used", ignoreRestSiblings: true}],
  },
};
