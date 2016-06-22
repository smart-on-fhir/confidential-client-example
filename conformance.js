var needle = require('needle');

var URLS = {
  oauth: "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris",
  register: "register",
  token: "token",
  authorize: "authorize"
};

var cache = {};

function parse(metadata){
  var ret = {};
  ((metadata && metadata.rest) || []).forEach(function(r){
    ((r && r.security && r.security.extension) || [])
    .filter(function(e){ return e.url === URLS.oauth;})
    .forEach(function(etop){
      (etop.extension || []).forEach(function(e){
        Object.keys(URLS).forEach(function(u){
          if (e.url === u){
            ret[u] = e.valueUri
          }
        })
      });
    })
  })
  return ret;
};

module.exports = function(iss){
  var noCache = arguments[1] === true;
  return new Promise(function(resolve, reject){
    if (!noCache && cache[iss]){
      return resolve(cache[iss]);
    }
    console.log("Get metaat for", iss);
    needle.get(iss + '/metadata', {
      parse_response: false,
      decode_response: true,
      headers: {
        accept: 'application/fhir+json'
      }
    }, function(err, resp){
    console.log("got metaat for", iss);
      if (resp.body){
        var u = cache[iss] = parse(JSON.parse(resp.body.toString()));
        console.log("Andn it's", u);
        return resolve(u);
      }
      reject("bad mdatadata response");
    })
  });
}
