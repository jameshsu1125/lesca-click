"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPreventDefault = exports.remove = exports.install = exports["default"] = exports.dataset = exports.clear = exports.addPreventExcept = exports.add = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _constants = require("./constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/**
 * event dataset
 */
var dataset = {};
exports.dataset = dataset;
var mousePropertyDown = {
  x: 0,
  y: 0
};
var mousePropertyMove = {
  x: mousePropertyDown.x,
  y: mousePropertyDown.y
};
var extraEvent = {
  down: function down() {},
  move: function move() {},
  up: function up() {}
};
var state = {
  device: false,
  isPress: false,
  deviation: 30,
  preventDefault: true
};
var eventProperty = {
  passive: false,
  capture: false
};
var moveOffsetProperty = {
  x: 0,
  y: 0
};
var exceptParentClassIDDataset = [];
var rootElement = false;

var checkDataset = function checkDataset(e) {
  var target = e.target;
  ["".concat(target.id, "_id"), "".concat(target.className, "_class")].forEach(function (name) {
    var _dataset$name, _dataset;

    (_dataset$name = (_dataset = dataset)[name]) === null || _dataset$name === void 0 ? void 0 : _dataset$name.call(_dataset, e);
  });
};

var areWePreventDefault = function areWePreventDefault(e) {
  var preventDefault = state.preventDefault;
  var root = (0, _constants.FIND_ROOT)(e);
  var isRoot = false;

  if (rootElement) {
    if (rootElement.indexOf('.') >= 0) {
      isRoot = rootElement === ".".concat(root.className);
    } else if (rootElement.indexOf('#') >= 0) {
      isRoot = rootElement === "#".concat(root.id);
    }
  }

  if (isRoot) {
    var hasClassID = (0, _constants.CHECK_PARENT_HAS_CLASS)(e, exceptParentClassIDDataset);

    if (preventDefault && !hasClassID && e.cancelable && !e.defaultPrevented) {
      var n = e.target.localName;
      if (n != 'input' && n != 'button' && n != 'select') e.preventDefault();
    }
  }
};

var down = function down(e) {
  state.isPress = true;
  var x = e.clientX || e.targetTouches[0].clientX || false;
  var y = e.clientY || e.targetTouches[0].clientY || false;
  if (!x || !y) return;
  areWePreventDefault(e);
  mousePropertyDown.x = x;
  mousePropertyDown.y = y;
  mousePropertyMove.x = x;
  mousePropertyMove.y = y;
  extraEvent.down(e);
};

var move = function move(e) {
  if (!state.isPress) return;
  var x = e.clientX || e.targetTouches[0].clientX || false;
  var y = e.clientY || e.targetTouches[0].clientY || false;
  if (!x || !y) return;
  areWePreventDefault(e);
  var dx = mousePropertyDown.x,
      dy = mousePropertyDown.y;
  moveOffsetProperty.x = x - dx;
  moveOffsetProperty.y = y - dy;
  mousePropertyMove.x = x;
  mousePropertyMove.y = y;
  extraEvent.move(_objectSpread(_objectSpread({}, e), {}, {
    moveOffsetProperty: moveOffsetProperty
  }));
};

var up = function up(e) {
  state.isPress = false;
  var dx = mousePropertyDown.x,
      dy = mousePropertyDown.y;
  var mx = mousePropertyMove.x,
      my = mousePropertyMove.y;
  var deviation = state.deviation;
  var m = Math.sqrt(Math.pow(mx - dx, 2) + Math.pow(my - dy, 2));
  if (m < deviation) checkDataset(e);
  extraEvent.up(e);
};

var addListener = function addListener(device) {
  if (device === 'mobile') {
    document.addEventListener('touchstart', down, eventProperty);
    document.addEventListener('touchmove', move, eventProperty);
    document.addEventListener('touchend', up);
  } else {
    document.addEventListener('mousedown', down);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }
};

var removeListener = function removeListener(device) {
  if (device === 'mobile') {
    document.removeEventListener('mousedown', down);
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
  } else {
    document.removeEventListener('touchstart', down);
    document.removeEventListener('touchmove', move);
    document.removeEventListener('touchend', up);
  }
};

var eventTransform = function eventTransform() {
  var device = state.device;
  var d = (0, _constants.GET_DEVICE)();

  if (!device) {
    state.device = d;
    addListener(d);
  } else if (device !== d) {
    state.device = d;
    removeListener(d);
    addListener(d);
  }
};
/**
 *
 * @param {queryString} query make sure it's uni-name.(ex: .target || #target)
 */


var addPreventExcept = function addPreventExcept(query) {
  var type = (0, _typeof2["default"])(query);
  if (type === 'string') exceptParentClassIDDataset.push(query);else if (Array.isArray(query)) {
    exceptParentClassIDDataset = (0, _toConsumableArray2["default"])(query);
  }
};
/**
 * set preventDefault will call or not.
 * @param {boolean} value
 */


exports.addPreventExcept = addPreventExcept;

var setPreventDefault = function setPreventDefault(value) {
  state.preventDefault = value;
};
/**
 *
 * @param {queryString} query make sure it's uni-name.(ex: .target || #target)
 * @param {function} callback call when click
 * @returns
 */


exports.setPreventDefault = setPreventDefault;

var add = function add(query, callback) {
  if (!callback) return;
  var type = query.slice(0, 1) === '.' ? '_class' : '_id';
  var name = query.slice(1);
  var key = name + type;
  dataset[key] = callback;
};

exports.add = add;

var remove = function remove(query) {
  var type = query.slice(0, 1) == '.' ? '_class' : '_id';
  var name = query.slice(1);
  var key = name + type;
  delete dataset[key];
};
/**
 * add events
 */


exports.remove = remove;

var install = function install() {
  var app = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#app';
  rootElement = app;
  eventTransform();
  window.addEventListener('resize', eventTransform);
};
/**
 * clear all dataset
 */


exports.install = install;

var clear = function clear() {
  exports.dataset = dataset = {};
};

exports.clear = clear;
var Click = {
  install: install,
  dataset: dataset,
  addPreventExcept: addPreventExcept,
  setPreventDefault: setPreventDefault,
  add: add,
  clear: clear,
  remove: remove
};
var _default = Click;
exports["default"] = _default;