var querystring = require("querystring");
var conformance = require('./conformance');
var needle = require('needle');

module.exports = function(iss, code, client){
  return conformance(iss).then(function(uris){
    return new Promise(function(resolve, reject){
    console.log("posting to");
      return needle.post(
        uris.token,
        querystring.stringify({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: client.redirect_uri
        }),
        {
          username: client.client_id,
          password: client.client_secret,
          headers: {
            accept: 'application/fhir+json'
          }
        }, function(err, resp){
          if (resp.body){
            resolve(JSON.parse(resp.body.toString()));
          }
          reject("bad token response" + err);
        });
    });
  });
}
