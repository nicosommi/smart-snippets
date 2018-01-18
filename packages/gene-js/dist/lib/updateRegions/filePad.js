'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _blockJs = require('block-js');

var _blockJs2 = _interopRequireDefault(_blockJs);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _regexParser = require('regex-parser');

var _regexParser2 = _interopRequireDefault(_regexParser);

var _getMeta = require('../getMeta');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FilePad = function () {
  function FilePad() {
    _classCallCheck(this, FilePad);

    this.stamps = [];
    this.phs = [];
  }

  _createClass(FilePad, [{
    key: 'initialize',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(filePath) {
        var _this = this;

        var blocks;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.filePath = filePath;

                if (!(filePath && _get__('fs').existsSync(filePath))) {
                  _context.next = 28;
                  break;
                }

                _context.prev = 2;

                this.delimiters = _get__('getDelimiters')(filePath);
                // TODO: take this to block js, along with other useful functions to manipulate code
                this.delimiters.inlineRegex = this.delimiters.inline.replace(/\//g, '\\\/');
                _context.next = 7;
                return new (_get__('Blocks'))(filePath, 'archetype').extractBlocks();

              case 7:
                blocks = _context.sent;

                this._archetype = blocks[0].name;
                Object.defineProperty(this, 'archetype', {
                  get: function get() {
                    return _this._archetype.trim();
                  },
                  set: function set(v) {
                    _this._archetype = v;
                  }
                });
                _context.next = 12;
                return new (_get__('Blocks'))(filePath, 'version').extractBlocks();

              case 12:
                blocks = _context.sent;

                this._version = blocks[0].name;
                Object.defineProperty(this, 'version', {
                  get: function get() {
                    return _this._version.trim();
                  },
                  set: function set(v) {
                    _this._version = v;
                  }
                });
                _context.next = 17;
                return new (_get__('Blocks'))(filePath, 'ph').extractBlocks();

              case 17:
                this.phs = _context.sent;
                _context.next = 20;
                return new (_get__('Blocks'))(filePath, 'stamp').extractBlocks();

              case 20:
                this.stamps = _context.sent;

                this.replacements = _get__('takeReplacements')(this.phs, this.delimiters.start, this.delimiters.end);
                _context.next = 28;
                break;

              case 24:
                _context.prev = 24;
                _context.t0 = _context['catch'](2);

                console.error(_context.t0);
                throw Error('Invalid region format when parsing ' + filePath);

              case 28:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 24]]);
      }));

      function initialize(_x) {
        return _ref.apply(this, arguments);
      }

      return initialize;
    }()
  }, {
    key: 'hasDifferentArchetypeThan',
    value: function hasDifferentArchetypeThan(basePad) {
      return this.archetype && this.archetype !== basePad.archetype;
    }
  }, {
    key: 'isOlderVersion',
    value: function isOlderVersion(basePad) {
      return this.version && _get__('semver').compare(this.version, basePad.version) >= 0;
    }
  }, {
    key: 'isMissingArchetype',
    value: function isMissingArchetype() {
      return !this.archetype && this.version;
    }
  }, {
    key: 'isMissingVersion',
    value: function isMissingVersion() {
      return this.archetype && !this.version;
    }
  }, {
    key: 'isNew',
    value: function isNew() {
      return !this.archetype && !this.version;
    }
  }, {
    key: 'isPhWithin',
    value: function isPhWithin(ln) {
      return this.phs.find(function (ph) {
        return ln > ph.from && ln < ph.to;
      }) !== undefined;
    }
  }, {
    key: 'isStampWithin',
    value: function isStampWithin(ln) {
      return this.stamps.find(function (stamp) {
        return ln > stamp.from && ln < stamp.to;
      }) !== undefined;
    }
  }, {
    key: 'isPhEnd',
    value: function isPhEnd(ln) {
      return this.phs.find(function (ph) {
        return ln === ph.to;
      }) !== undefined;
    }
  }, {
    key: 'isStampEnd',
    value: function isStampEnd(ln) {
      return this.stamps.find(function (stamp) {
        return ln === stamp.to;
      }) !== undefined;
    }
  }, {
    key: 'checkValid',
    value: function checkValid() {
      if (this.isMissingArchetype()) {
        throw Error('Missing archetype on ' + this.filePath);
      }
      if (this.isMissingVersion()) {
        throw Error('Missing version on ' + this.filePath);
      }
    }
  }, {
    key: 'checkCanBeUpdatedBy',
    value: function checkCanBeUpdatedBy(basePad) {
      this.checkValid();
      basePad.checkValid();
      if (this.hasDifferentArchetypeThan(basePad)) {
        throw Error('Cannot update. Archetype mismatch');
      } else if (this.isOlderVersion(basePad)) {
        throw Error('Cannot update. Target archetype version is newer than origin');
      }
    }
  }, {
    key: 'getPh',
    value: function getPh(sph) {
      var res = this.phs.find(function (ph) {
        return ph.name === sph.name;
      });
      if (!res) {
        return Object.assign({}, sph);
      } else {
        return Object.assign({}, sph, { content: res.content, flags: res.flags });
      }
    }
  }, {
    key: 'getPhByLineNumber',
    value: function getPhByLineNumber(ln) {
      return this.phs.find(function (ph) {
        return ph.from === ln;
      });
    }
  }, {
    key: 'getStampByLineNumber',
    value: function getStampByLineNumber(ln) {
      return this.stamps.find(function (stamp) {
        return stamp.from === ln;
      });
    }
  }, {
    key: 'commentContent',
    value: function commentContent(content) {
      var _this2 = this;

      var lines = content.split('\n');
      var initialChunk = void 0;
      return lines.map(function (l) {
        if (l.trim().indexOf(_this2.delimiters.inline) === 0) {
          return l;
        }
        var re = new RegExp('^(\\s*)(.*)');
        var beginning = re.exec(l);
        if (!initialChunk) {
          initialChunk = beginning[1];
        }
        var pad = '';
        if (beginning[1].length > initialChunk.length) {
          pad = ' '.repeat(beginning[1].length - initialChunk.length);
        }
        return '' + initialChunk + _this2.delimiters.inline + pad + ' ' + beginning[2];
      }).join('\n');
    }
  }, {
    key: 'uncommentContent',
    value: function uncommentContent(content) {
      var _this3 = this;

      var lines = content.split('\n');
      return lines.map(function (l) {
        if (l.trim().indexOf(_this3.delimiters.inline) === 0) {
          var re = new RegExp('^(\\s*)' + _this3.delimiters.inlineRegex + '\\s(.*)');
          var beginning = re.exec(l);
          return '' + beginning[1] + beginning[2];
        }
        return l;
      }).join('\n');
    }
  }, {
    key: 'isBlockIgnored',
    value: function isBlockIgnored(block) {
      return block.flags !== undefined && block.flags.indexOf('ignored') >= 0;
    }
  }, {
    key: 'getStamp',
    value: function getStamp(sstamp) {
      var found = this.stamps.find(function (stamp) {
        return stamp.name === sstamp.name;
      });
      var res = Object.assign({}, sstamp);
      if (found) {
        var content = sstamp.content;
        if (this.isBlockIgnored(found) && !this.isBlockIgnored(sstamp)) {
          content = this.commentContent(sstamp.content);
        } else if (!this.isBlockIgnored(found) && this.isBlockIgnored(sstamp)) {
          content = this.uncommentContent(sstamp.content);
        }
        res = Object.assign({}, sstamp, { content: content, flags: found.flags });
      }
      return res;
    }
  }, {
    key: 'replicateReplacements',
    value: function replicateReplacements() {
      var _this4 = this;

      var basePadKeys = Object.keys(this.basePad.replacements || {});
      var thisPadKeys = Object.keys(this.replacements || {});
      // iterate base replacements
      var resultingReplacements = basePadKeys.reduce(function (acc, basePadKey) {
        // find on this
        var thisPadKey = thisPadKeys.find(function (tpk) {
          return tpk === basePadKey;
        });
        if (thisPadKey) {
          // if found, preserve
          return Object.assign(acc, _defineProperty({}, basePadKey, {
            regex: _this4.replacements[thisPadKey].regex,
            value: _this4.replacements[thisPadKey].value
          }));
        } else {
          // if new, assign and push
          return Object.assign(acc, _defineProperty({}, basePadKey, {
            regex: _this4.basePad.replacements[basePadKey].regex,
            value: _this4.basePad.replacements[basePadKey].value
          }));
        }
      }, {});
      if (Object.keys(resultingReplacements).length > 0) {
        // override replacement ph
        this.phs = this.phs.map(function (ph) {
          if (ph.name === 'replacements') {
            var content = _this4.joinReplacements(resultingReplacements);
            return Object.assign(ph, {
              content: content
            });
          } else {
            return ph;
          }
        });
      } else {
        // filter out replacement ph
        this.phs = this.phs.filter(function (ph) {
          return ph.name !== 'replacements';
        });
      }
    }
  }, {
    key: 'joinReplacements',
    value: function joinReplacements(replacements) {
      var _this5 = this;

      return Object.keys(replacements).map(function (replacementKey) {
        return _this5.delimiters.start + ' ' + replacementKey + ', ' + replacements[replacementKey].regex + ', ' + replacements[replacementKey].value + ' ' + _this5.delimiters.end;
      }).join('\n');
    }
  }, {
    key: 'executeReplacements',
    value: function executeReplacements(content) {
      var _this6 = this;

      return Object.keys(this.replacements || {}).reduce(function (acc, replacementKey) {
        var replacement = _this6.replacements[replacementKey];
        var sourceRegex = _this6.basePad.replacements[replacementKey].regex;

        var r = _get__('regexParser')(sourceRegex);

        return acc.replace(r, replacement.value);
      }, content);
    }
  }, {
    key: 'buildOneLinerBlock',
    value: function buildOneLinerBlock(blockName, block) {
      return this.delimiters.inline + ' ' + blockName + ' ' + block.name;
    }
  }, {
    key: 'buildBlockHeader',
    value: function buildBlockHeader(blockName, block) {
      var originalLine = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      var flags = '';
      if (block.flags) {
        flags = '(' + block.flags + ') ';
      }
      var prefix = '';
      var spaces = originalLine.match(/^(\s+)/);
      if (spaces && spaces.length) {
        prefix = spaces[0];
      }
      return '' + prefix + this.delimiters.start + ' ' + blockName + ' ' + block.name + ' ' + flags + this.delimiters.end;
    }
  }, {
    key: 'isOneLiner',
    value: function isOneLiner(block) {
      return block.to === block.from;
    }
  }, {
    key: 'processLine',
    value: function processLine(l, ln) {
      // FIXME:
      // - stamp uncomment and comment if necessary, and with line indentation
      // - execute replacements
      var ph = this.getPhByLineNumber(ln);
      if (ph) {
        if (this.isOneLiner(ph)) {
          return '' + ph.content + this.buildOneLinerBlock('ph', ph) + '\n';
        } else {
          return this.buildBlockHeader('ph', ph, l) + '\n' + ph.content + '\n';
        }
      }
      var stamp = this.getStampByLineNumber(ln);
      if (stamp) {
        var res = stamp.content;
        this.executeReplacements(res);
        if (this.isOneLiner(stamp)) {
          return '' + stamp.content + this.buildOneLinerBlock('stamp', stamp) + '\n';
        } else {
          return this.buildBlockHeader('stamp', stamp, l) + '\n' + stamp.content + '\n';
        }
      }
      if (this.isPhWithin(ln) || this.isStampWithin(ln)) {
        return '';
      }
      if (this.isPhEnd(ln) || this.isStampEnd(ln)) {
        return l + '\n';
      }
      return this.executeReplacements(l) + '\n';
    }

    // public methods

  }, {
    key: 'updateWith',
    value: function updateWith(basePad) {
      var _this7 = this;

      this.basePad = basePad;
      this.baseStream = _get__('fs').createReadStream(basePad.filePath, { encoding: 'utf8' });
      this.delimiters = _get__('getDelimiters')(basePad.filePath);
      this._archetype = basePad._archetype;
      this._version = basePad._version;
      this.phs = basePad.phs.map(function (ph) {
        return _this7.getPh(ph);
      });
      this.stamps = basePad.stamps.map(function (stamp) {
        return _this7.getStamp(stamp);
      });
      this.replicateReplacements();
    }
  }, {
    key: 'flushTo',
    value: function flushTo(outputStream) {
      var _this8 = this;

      return new Promise(function (resolve) {
        var lineReader = _get__('readline').createInterface({ input: _this8.baseStream });
        var ln = 1;
        lineReader.on('line', function (line) {
          var finalLine = _this8.processLine(line, ln);
          outputStream.write(finalLine);
          ln++;
        });

        lineReader.on('close', function () {
          if (outputStream !== process.stdout) outputStream.end();
          resolve();
        });
      });
    }
  }]);

  return FilePad;
}();

exports.default = FilePad;

function _getGlobalObject() {
  try {
    if (!!global) {
      return global;
    }
  } catch (e) {
    try {
      if (!!window) {
        return window;
      }
    } catch (e) {
      return this;
    }
  }
}

;
var _RewireModuleId__ = null;

function _getRewireModuleId__() {
  if (_RewireModuleId__ === null) {
    var globalVariable = _getGlobalObject();

    if (!globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__) {
      globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0;
    }

    _RewireModuleId__ = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++;
  }

  return _RewireModuleId__;
}

function _getRewireRegistry__() {
  var theGlobalVariable = _getGlobalObject();

  if (!theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__) {
    theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null);
  }

  return __$$GLOBAL_REWIRE_REGISTRY__;
}

function _getRewiredData__() {
  var moduleId = _getRewireModuleId__();

  var registry = _getRewireRegistry__();

  var rewireData = registry[moduleId];

  if (!rewireData) {
    registry[moduleId] = Object.create(null);
    rewireData = registry[moduleId];
  }

  return rewireData;
}

(function registerResetAll() {
  var theGlobalVariable = _getGlobalObject();

  if (!theGlobalVariable['__rewire_reset_all__']) {
    theGlobalVariable['__rewire_reset_all__'] = function () {
      theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null);
    };
  }
})();

var INTENTIONAL_UNDEFINED = '__INTENTIONAL_UNDEFINED__';
var _RewireAPI__ = {};

(function () {
  function addPropertyToAPIObject(name, value) {
    Object.defineProperty(_RewireAPI__, name, {
      value: value,
      enumerable: false,
      configurable: true
    });
  }

  addPropertyToAPIObject('__get__', _get__);
  addPropertyToAPIObject('__GetDependency__', _get__);
  addPropertyToAPIObject('__Rewire__', _set__);
  addPropertyToAPIObject('__set__', _set__);
  addPropertyToAPIObject('__reset__', _reset__);
  addPropertyToAPIObject('__ResetDependency__', _reset__);
  addPropertyToAPIObject('__with__', _with__);
})();

function _get__(variableName) {
  var rewireData = _getRewiredData__();

  if (rewireData[variableName] === undefined) {
    return _get_original__(variableName);
  } else {
    var value = rewireData[variableName];

    if (value === INTENTIONAL_UNDEFINED) {
      return undefined;
    } else {
      return value;
    }
  }
}

function _get_original__(variableName) {
  switch (variableName) {
    case 'fs':
      return _fs2.default;

    case 'getDelimiters':
      return _blockJs.getDelimiters;

    case 'Blocks':
      return _blockJs2.default;

    case 'takeReplacements':
      return _getMeta.takeReplacements;

    case 'semver':
      return _semver2.default;

    case 'regexParser':
      return _regexParser2.default;

    case 'readline':
      return _readline2.default;
  }

  return undefined;
}

function _assign__(variableName, value) {
  var rewireData = _getRewiredData__();

  if (rewireData[variableName] === undefined) {
    return _set_original__(variableName, value);
  } else {
    return rewireData[variableName] = value;
  }
}

function _set_original__(variableName, _value) {
  switch (variableName) {}

  return undefined;
}

function _update_operation__(operation, variableName, prefix) {
  var oldValue = _get__(variableName);

  var newValue = operation === '++' ? oldValue + 1 : oldValue - 1;

  _assign__(variableName, newValue);

  return prefix ? newValue : oldValue;
}

function _set__(variableName, value) {
  var rewireData = _getRewiredData__();

  if ((typeof variableName === 'undefined' ? 'undefined' : _typeof(variableName)) === 'object') {
    Object.keys(variableName).forEach(function (name) {
      rewireData[name] = variableName[name];
    });
  } else {
    if (value === undefined) {
      rewireData[variableName] = INTENTIONAL_UNDEFINED;
    } else {
      rewireData[variableName] = value;
    }

    return function () {
      _reset__(variableName);
    };
  }
}

function _reset__(variableName) {
  var rewireData = _getRewiredData__();

  delete rewireData[variableName];

  if (Object.keys(rewireData).length == 0) {
    delete _getRewireRegistry__()[_getRewireModuleId__];
  }

  ;
}

function _with__(object) {
  var rewireData = _getRewiredData__();

  var rewiredVariableNames = Object.keys(object);
  var previousValues = {};

  function reset() {
    rewiredVariableNames.forEach(function (variableName) {
      rewireData[variableName] = previousValues[variableName];
    });
  }

  return function (callback) {
    rewiredVariableNames.forEach(function (variableName) {
      previousValues[variableName] = rewireData[variableName];
      rewireData[variableName] = object[variableName];
    });
    var result = callback();

    if (!!result && typeof result.then == 'function') {
      result.then(reset).catch(reset);
    } else {
      reset();
    }

    return result;
  };
}

var _typeOfOriginalExport = typeof FilePad === 'undefined' ? 'undefined' : _typeof(FilePad);

function addNonEnumerableProperty(name, value) {
  Object.defineProperty(FilePad, name, {
    value: value,
    enumerable: false,
    configurable: true
  });
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && Object.isExtensible(FilePad)) {
  addNonEnumerableProperty('__get__', _get__);
  addNonEnumerableProperty('__GetDependency__', _get__);
  addNonEnumerableProperty('__Rewire__', _set__);
  addNonEnumerableProperty('__set__', _set__);
  addNonEnumerableProperty('__reset__', _reset__);
  addNonEnumerableProperty('__ResetDependency__', _reset__);
  addNonEnumerableProperty('__with__', _with__);
  addNonEnumerableProperty('__RewireAPI__', _RewireAPI__);
}

exports.__get__ = _get__;
exports.__GetDependency__ = _get__;
exports.__Rewire__ = _set__;
exports.__set__ = _set__;
exports.__ResetDependency__ = _reset__;
exports.__RewireAPI__ = _RewireAPI__;