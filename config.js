module.exports = {
  port: require("./local-config/http").port,
  cookieSigningKeys: require("./local-config/cookie-signing-keys"),
  clients: require("./local-config/clients")
};
