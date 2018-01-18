'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = exports.getDelimiters = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _promise = require('./promise.js');

var _promise2 = _interopRequireDefault(_promise);

var _incognito = require('incognito');

var _incognito2 = _interopRequireDefault(_incognito);

var _getDelimiters = require('./getDelimiters.js');

var _getDelimiters2 = _interopRequireDefault(_getDelimiters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getBlockName = Symbol('getBlockName');
var isAnEndBlock = Symbol('isAnEndBlock');
var isAnStartBlock = Symbol('isAnStartBlock');
var isAInlineBlock = Symbol('isAInlineBlock');
var buildBlock = Symbol('buildBlock');
var buildInlineBlock = Symbol('buildInlineBlock');
var getInlineBlockName = Symbol('getInlineBlockName');

exports.getDelimiters = _getDelimiters2.default;

// TODO:
// - allow block name array
// - allow inline comment for multiline blocks
// - allow inline block for multiline comments
// * right now it is coupled one line comment to one line block
// * one line block is when there is code at the beginning instead of just spaces

var Blocks = function () {
  function Blocks(filePath, blockName, customDelimiters) {
    _classCallCheck(this, Blocks);

    _get__('_')(this).blockName = blockName;
    _get__('_')(this).filePath = filePath;

    var currentDelimiter = _get__('getDelimiters')(filePath, customDelimiters);

    this.startBlockString = currentDelimiter.start;
    this.endBlockString = currentDelimiter.end;

    this.regexStart = currentDelimiter.start.replace(/\/\*/g, '\\/\\*');
    this.regexEnd = currentDelimiter.end.replace(/\*\//g, '\\*\\/');
    if (currentDelimiter.inline) this.regexInline = currentDelimiter.inline.replace(/\*\//g, '\\*\\/');
  }

  _createClass(Blocks, [{
    key: _get__('getBlockName'),


    /*
    * returns the block name
    */
    value: function value(lineString) {
      this.regexStartBlock = new RegExp('\\s*' + this.regexStart + '\\s*' + _get__('_')(this).blockName + '\\s+(\\w[\\w\\-\\.]*)\\s*[(]*([\\s\\w\\,]*)[)]*\\s*' + this.regexEnd + '\\s*', 'g');
      var matches = this.regexStartBlock.exec(lineString);
      if (matches && matches.length > 0) {
        return { name: matches[1], flags: matches[2] };
      } else {
        throw new Error('Block without a name in file ' + _get__('_')(this).filePath);
      }
    }
  }, {
    key: _get__('getInlineBlockName'),
    value: function value(lineString) {
      this.regexStartBlock = new RegExp('^([\\w\\W\\s]*)' + this.regexInline + '\\s*' + _get__('_')(this).blockName + '\\s+(\\w[\\w\\-\\.]*)\\s*[(]*([\\s\\w\\,]*)[)]*\\s*', 'g');
      var matches = this.regexStartBlock.exec(lineString);
      if (matches && matches.length > 0) {
        return { content: matches[1], name: matches[2], flags: matches[3] };
      } else {
        throw new Error('Inline block without a name in file ' + _get__('_')(this).filePath);
      }
    }

    /*
    * returns true if the line is a block end
    */

  }, {
    key: _get__('isAnEndBlock'),
    value: function value(lineString) {
      this.regexEndBlock = new RegExp('\\s*' + this.regexStart + '\\s*end' + _get__('_')(this).blockName + '\\s*' + this.regexEnd + '\\s*', 'g');
      return this.regexEndBlock.test(lineString);
    }

    /*
    * returns true if the line is a block end
    */

  }, {
    key: _get__('isAnStartBlock'),
    value: function value(lineString) {
      this.regexStartBlock = new RegExp('\\s*' + this.regexStart + '\\s*' + _get__('_')(this).blockName + '[\\s+\\w\\-\\.]+\\s*[(]*[\\s\\w\\,]*[)]*\\s*' + this.regexEnd + '\\s*', 'g');
      return this.regexStartBlock.test(lineString);
    }
  }, {
    key: _get__('isAInlineBlock'),
    value: function value(lineString) {
      if (!this.regexInline) return false;
      this.regexInlineBlock = new RegExp('^([\\w\\W\\s]*)' + this.regexInline + '\\s*' + _get__('_')(this).blockName + '\\s+(\\w[\\w\\-\\.]*)\\s*[(]*([\\s\\w\\,]*)[)]*\\s*', 'g');
      return this.regexInlineBlock.test(lineString);
    }
  }, {
    key: _get__('buildBlock'),
    value: function value(lineNumber, lineString, reject) {
      try {
        var _getBlockName = this[getBlockName](lineString),
            name = _getBlockName.name,
            flags = _getBlockName.flags;

        var returnValue = { from: lineNumber + 1, name: name };
        if (flags && flags !== undefined) {
          returnValue.flags = flags;
        }
        return returnValue;
      } catch (e) {
        return reject(e);
      }
    }
  }, {
    key: _get__('buildInlineBlock'),
    value: function value(lineNumber, lineString, reject) {
      try {
        var _getInlineBlockName = this[getInlineBlockName](lineString),
            name = _getInlineBlockName.name,
            content = _getInlineBlockName.content,
            flags = _getInlineBlockName.flags;

        var returnValue = { from: lineNumber + 1, name: name, content: content };
        if (flags && flags !== undefined) {
          returnValue.flags = flags;
        }
        return returnValue;
      } catch (e) {
        return reject(e);
      }
    }

    /*
    * returns the blocks from a certain file
    */

  }, {
    key: 'extractBlocks',
    value: function extractBlocks() {
      var _this = this;

      return new (_get__('Promise'))(function (resolve, reject) {
        var result = [];

        // iterate file lines
        var input = _get__('fs').createReadStream(_get__('_')(_this).filePath, { encoding: 'utf8' });
        var lineReader = _get__('readline').createInterface({ input: input });
        var lineNumber = 0;
        var block = null;
        lineReader.on('line', function (lineString) {
          // name, from, to, content
          // detect block start
          // activate inside block flag
          if (!block && _this[isAnStartBlock](lineString)) {
            block = _this[buildBlock](lineNumber, lineString, reject);
          } else if (block && _this[isAnEndBlock](lineString)) {
            block.to = lineNumber + 1;
            // add block to result
            result.push(block);
            // deactivate inside block
            block = null;
          } else if (!block && _this[isAInlineBlock](lineString)) {
            block = _this[buildInlineBlock](lineNumber, lineString, reject);
            block.to = block.from;
            result.push(block);
            block = null;
          } else if (block && !block.content) {
            block.content = lineString;
          } else if (block && block.content) {
            block.content += '\n' + lineString;
          }

          lineNumber++;
        });

        input.on('error', function (error) {
          reject(error);
        });

        lineReader.on('close', function () {
          lineReader.close();
          resolve(result);
        });
      });
    }
  }, {
    key: 'blockName',
    get: function get() {
      return _get__('_')(this).blockName;
    }
  }]);

  return Blocks;
}();

exports.default = Blocks;

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
    case '_':
      return _incognito2.default;

    case 'getDelimiters':
      return _getDelimiters2.default;

    case 'Promise':
      return _promise2.default;

    case 'fs':
      return _fs2.default;

    case 'readline':
      return _readline2.default;

    case 'getBlockName':
      return getBlockName;

    case 'getInlineBlockName':
      return getInlineBlockName;

    case 'isAnEndBlock':
      return isAnEndBlock;

    case 'isAnStartBlock':
      return isAnStartBlock;

    case 'isAInlineBlock':
      return isAInlineBlock;

    case 'buildBlock':
      return buildBlock;

    case 'buildInlineBlock':
      return buildInlineBlock;
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

var _typeOfOriginalExport = typeof Blocks === 'undefined' ? 'undefined' : _typeof(Blocks);

function addNonEnumerableProperty(name, value) {
  Object.defineProperty(Blocks, name, {
    value: value,
    enumerable: false,
    configurable: true
  });
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && Object.isExtensible(Blocks)) {
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