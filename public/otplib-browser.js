/*!
 * otplib
 *
 * Copyright (c) 2012-2020, GPL-3.0-or-later
 * Copyright (c) 2020-present, GPL-3.0-or-later
 * https://github.com/yeojz/otplib
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.otplib = {}));
}(this, (function (exports) { 'use strict';

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    var createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    var inherits = function (subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    };

    var possibleConstructorReturn = function (self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return call && (typeof call === "object" || typeof call === "function") ? call : self;
    };

    var toConsumableArray = function (arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

        return arr2;
      } else {
        return Array.from(arr);
      }
    };

    var crypto = typeof window !== 'undefined' ? window.crypto || window.msCrypto : null;

    var randomBytes = function randomBytes(size) {
      var buffer = new Uint8Array(size);
      crypto.getRandomValues(buffer);
      return buffer;
    };

    var createHmac = function createHmac(algorithm, key) {
      var crypto = window.crypto || window.msCrypto;
      var subtle = crypto.subtle || crypto.webkitSubtle;

      var keyBuffer = typeof key === 'string' ? new TextEncoder().encode(key) : key;
      var algorithm = { name: 'HMAC', hash: { name: 'SHA-1' } };

      return {
        update: function update(data) {
          var dataBuffer = typeof data === 'string' ? new TextEncoder().encode(data) : data;
          return subtle.importKey('raw', keyBuffer, algorithm, false, ['sign'])
            .then(function (key) {
              return subtle.sign(algorithm, key, dataBuffer);
            })
            .then(function (signature) {
              return new Uint8Array(signature);
            });
        }
      };
    };

    var createHash = function createHash(algorithm) {
      var crypto = window.crypto || window.msCrypto;
      var subtle = crypto.subtle || crypto.webkitSubtle;

      return {
        update: function update(data) {
          var dataBuffer = typeof data === 'string' ? new TextEncoder().encode(data) : data;
          return subtle.digest({ name: 'SHA-1' }, dataBuffer)
            .then(function (hash) {
              return new Uint8Array(hash);
            });
        }
      };
    };

    var createDecipheriv = function createDecipheriv(algorithm, key, iv) {
      var crypto = window.crypto || window.msCrypto;
      var subtle = crypto.subtle || crypto.webkitSubtle;

      var keyBuffer = typeof key === 'string' ? new TextEncoder().encode(key) : key;
      var ivBuffer = typeof iv === 'string' ? new TextEncoder().encode(iv) : iv;

      return {
        update: function update(data) {
          var dataBuffer = typeof data === 'string' ? new TextEncoder().encode(data) : data;
          return subtle.importKey('raw', keyBuffer, { name: 'AES-CBC', length: 256 }, false, ['decrypt'])
            .then(function (key) {
              return subtle.decrypt({ name: 'AES-CBC', iv: ivBuffer }, key, dataBuffer);
            })
            .then(function (decrypted) {
              return new Uint8Array(decrypted);
            });
        }
      };
    };

    var createCipheriv = function createCipheriv(algorithm, key, iv) {
      var crypto = window.crypto || window.msCrypto;
      var subtle = crypto.subtle || crypto.webkitSubtle;

      var keyBuffer = typeof key === 'string' ? new TextEncoder().encode(key) : key;
      var ivBuffer = typeof iv === 'string' ? new TextEncoder().encode(iv) : iv;

      return {
        update: function update(data) {
          var dataBuffer = typeof data === 'string' ? new TextEncoder().encode(data) : data;
          return subtle.importKey('raw', keyBuffer, { name: 'AES-CBC', length: 256 }, false, ['encrypt'])
            .then(function (key) {
              return subtle.encrypt({ name: 'AES-CBC', iv: ivBuffer }, key, dataBuffer);
            })
            .then(function (encrypted) {
              return new Uint8Array(encrypted);
            });
        }
      };
    };

    var createHmac$1 = createHmac;
    var createHash$1 = createHash;
    var createDecipheriv$1 = createDecipheriv;
    var createCipheriv$1 = createCipheriv;
    var randomBytes$1 = randomBytes;

    var crypto$1 = {
      createHmac: createHmac$1,
      createHash: createHash$1,
      createDecipheriv: createDecipheriv$1,
      createCipheriv: createCipheriv$1,
      randomBytes: randomBytes$1
    };

    var base32 = {
      encode: function encode(str) {
        var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        var buffer = new Uint8Array(str.length);
        for (var i = 0; i < str.length; i++) {
          buffer[i] = str.charCodeAt(i);
        }
        var bits = 0;
        var value = 0;
        var result = '';
        for (var i = 0; i < buffer.length; i++) {
          value = (value << 8) | buffer[i];
          bits += 8;
          while (bits >= 5) {
            result += alphabet[(value >>> (bits - 5)) & 31];
            bits -= 5;
          }
        }
        if (bits > 0) {
          result += alphabet[(value << (5 - bits)) & 31];
        }
        while (result.length % 8 !== 0) {
          result += '=';
        }
        return result;
      },
      decode: function decode(str) {
        var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        var buffer = new Uint8Array(str.length * 5 / 8);
        var bits = 0;
        var value = 0;
        var index = 0;
        for (var i = 0; i < str.length; i++) {
          value = (value << 5) | alphabet.indexOf(str[i].toUpperCase());
          bits += 5;
          if (bits >= 8) {
            buffer[index++] = (value >>> (bits - 8)) & 255;
            bits -= 8;
          }
        }
        return buffer;
      }
    };

    var authenticator = {
      generate: function generate(secret) {
        var counter = Math.floor(Date.now() / 30000);
        var counterBytes = new Uint8Array(8);
        for (var i = 7; i >= 0; i--) {
          counterBytes[i] = counter & (0xff << ((7 - i) * 8)) >>> ((7 - i) * 8);
        }
        var key = base32.decode(secret);
        var hmac = crypto$1.createHmac('sha1', key);
        return hmac.update(counterBytes).then(function (hash) {
          var offset = hash[hash.length - 1] & 0xf;
          var code = ((hash[offset] & 0x7f) << 24) |
                    ((hash[offset + 1] & 0xff) << 16) |
                    ((hash[offset + 2] & 0xff) << 8) |
                    (hash[offset + 3] & 0xff);
          return (code % 1000000).toString().padStart(6, '0');
        });
      },
      verify: function verify(token, secret) {
        return this.generate(secret).then(function (generatedToken) {
          return token === generatedToken;
        });
      }
    };

    exports.authenticator = authenticator;
    exports.crypto = crypto$1;
    exports.base32 = base32;

    Object.defineProperty(exports, '__esModule', { value: true });

}))); 