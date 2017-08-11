// Generated by CoffeeScript 1.8.0

// added AMD support, removed forcing identity
(function (root, factory) {
    define(["strophe", "strophe.disco"], function (Strophe) {
        factory(Strophe.Strophe, Strophe.SHA1, Strophe.$build, Strophe.$iq, Strophe.$msg, Strophe.$pres);
    });
}(this, function (Strophe, SHA1, $build, $iq, $msg, $pres) {
    var b64_sha1 = SHA1.b64_sha1;

      Strophe.addConnectionPlugin('caps', (function() {
        var addFeature, conn, createCapsNode, generateVerificationString, init, propertySort, removeFeature, sendPres;
        conn = null;
        init = function(c) {
          conn = c;
          Strophe.addNamespace('CAPS', "http://jabber.org/protocol/caps");
          if (conn.disco === void 0) {
            throw new Error("disco plugin required!");
          }
          if (b64_sha1 === void 0) {
            throw new Error("SHA-1 library required!");
          }
          conn.disco.addFeature(Strophe.NS.CAPS);
          conn.disco.addFeature(Strophe.NS.DISCO_INFO);
        };
        addFeature = function(feature) {
          return conn.disco.addFeature(feature);
        };
        removeFeature = function(feature) {
          return conn.disco.removeFeature(feature);
        };
        getPres = function () {
          return $pres().cnode(createCapsNode());
        };
        sendPres = function() {
          return conn.send($pres().cnode(createCapsNode().tree()));
        };
        createCapsNode = function(options) {
          options || (options = {});
          var node = options.node;
          if (!node) {
            if (conn.disco._identities.length > 0) {
              node = conn.disco._identities[0].name || "";
            } else {
              node = "strophejs";
            }
          }
          return $build("c", {
            xmlns: Strophe.NS.CAPS,
            hash: "sha-1",
            node: node,
            ver: generateVerificationString()
          });
        };
        propertySort = function(array, property) {
          return array.sort(function(a, b) {
            if (a[property] > b[property]) {
              return -1;
            } else {
              return 1;
            }
          });
        };
        generateVerificationString = function() {
          var S, features, i, id, ids, k, key, ns, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
          ids = [];
          _ref = conn.disco._identities;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            ids.push(i);
          }
          features = [];
          _ref1 = conn.disco._features;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            k = _ref1[_j];
            features.push(k);
          }
          S = "";
          propertySort(ids, "category");
          propertySort(ids, "type");
          propertySort(ids, "lang");
          for (key in ids) {
            id = ids[key];
            S += "" + id.category + "/" + id.type + "/" + id.lang + "/" + id.name + "<";
          }
          features.sort();
          for (_k = 0, _len2 = features.length; _k < _len2; _k++) {
            ns = features[_k];
            S += "" + ns + "<";
          }
          return b64_sha1(S);
        };
        return {
          init: init,
          removeFeature: removeFeature,
          addFeature: addFeature,
          sendPres: sendPres,
          generateVerificationString: generateVerificationString,
          createCapsNode: createCapsNode
        };
      })());
}));
