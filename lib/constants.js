"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET_DEVICE = exports.FIND_ROOT = exports.CHECK_PARENT_HAS_CLASS = void 0;

var _mobileDetect = _interopRequireDefault(require("mobile-detect"));

var GET_DEVICE = function GET_DEVICE() {
  var m = new _mobileDetect["default"](window.navigator.userAgent);
  if (m.tablet()) return 'mobile';else if (m.mobile()) return 'mobile';else return 'desktop';
};
/**
 *
 * @param {event} e
 * @param {array} classDataset
 */


exports.GET_DEVICE = GET_DEVICE;

var CHECK_PARENT_HAS_CLASS = function CHECK_PARENT_HAS_CLASS(e, classDataset) {
  var target = e.target;
  var node = target;
  var result = [];

  var _loop = function _loop() {
    var _node = node,
        id = _node.id,
        className = _node.className;
    var is = classDataset.filter(function (e) {
      var attr = e.slice(0, 1);
      var name = e.slice(1);

      switch (attr) {
        case '.':
          if (className === name) return true;
          break;

        case '#':
          if (id === name) return true;
          break;
      }

      return false;
    }).length > 0;
    if (is) result.push(node);
    node = node.parentNode;
  };

  while (node.tagName !== 'HTML') {
    _loop();
  }

  return result.length > 0;
};

exports.CHECK_PARENT_HAS_CLASS = CHECK_PARENT_HAS_CLASS;

var FIND_ROOT = function FIND_ROOT(e) {
  var target = e.target;
  var node = target;
  var result;

  while (node.tagName !== 'BODY') {
    result = node;
    node = node.parentNode;
  }

  return result;
};

exports.FIND_ROOT = FIND_ROOT;