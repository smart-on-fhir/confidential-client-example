var config = require("./config");
var app = module.exports = require("./server");

if (!module.parent) {
  app.listen(config.port);
  console.log("SMART launcher running on port: " + config.port);
}
