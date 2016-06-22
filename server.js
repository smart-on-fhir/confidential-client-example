var express = require("express");
var path = require("path");
var config = require("./config");
var logger = require("morgan");
var conformance = require("./conformance");
var cookieSession = require("cookie-session")
var uuid = require("node-uuid")
var querystring = require("querystring");
var app = module.exports = express();

app.use(logger("dev"));

app.use(cookieSession({
  name: "session",
  keys: config.cookieSigningKeys
}))

app.get("/launch.html", function(req, res, next){
  var iss = req.query.iss;
  var launch = req.query.launch;
  req.session.state = uuid.v4();
  console.log("Launch with", iss, launch);
  var client = config.clients[iss];
  conformance(iss).then(function(uris){
    var options = {
      response_type: "code",
      client_id: client.client_id,
      redirect_uri: client.redirect_uri,
      launch: launch,
      scope: client.scope,
      state: req.session.state,
      aud: iss
    };
    if (!launch) {
      delete options.launch;
    }
    console.log("Redirecting", uris.authorize, options);
    res.redirect(uris.authorize + "?" + querystring.stringify(options));
  }).catch(next);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err.stack);
});

app.use(express.static("static"));
