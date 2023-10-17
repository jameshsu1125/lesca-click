"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPreventDefault = exports.setEnabled = exports.remove = exports.install = exports["default"] = exports.dataset = exports.clear = exports.addPreventExcept = exports.add = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _misc = require("./misc");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var dataset = exports.dataset = {};
var mousePropertyDown = {
  x: 0,
  y: 0
};
var mousePropertyMove = {
  x: mousePropertyDown.x,
  y: mousePropertyDown.y
};
var moveOffsetProperty = {
  x: 0,
  y: 0
};
var extraEvent = {
  down: function down(e) {},
  move: function move(e) {},
  up: function up(e) {}
};
var state = {
  device: '',
  isPress: false,
  deviation: 30,
  preventDefault: true,
  enabled: true
};
var eventProperty = {
  passive: false,
  capture: false
};
var exceptParentClassIDDataset = [];
var rootElement = '';
var checkDataset = function checkDataset(e) {
  var target = e.target;
  if (target) {
    if (target instanceof Element) {
      ["".concat(target.id, "_id"), "".concat(target.className, "_class")].forEach(function (name) {
        var _dataset$name, _dataset;
        (_dataset$name = (_dataset = dataset)[name]) === null || _dataset$name === void 0 || _dataset$name.call(_dataset, e);
      });
    }
  }
};
var eventTransform = function eventTransform() {
  var device = state.device;
  var d = (0, _misc.GET_DEVICE)();
  if (!device) {
    state.device = d;
    addListener(d);
  } else if (device !== d) {
    state.device = d;
    removeListener(d);
    addListener(d);
  }
};
var areWePreventDefault = function areWePreventDefault(e) {
  var preventDefault = state.preventDefault,
    enabled = state.enabled;
  if (!enabled) return;
  var root = (0, _misc.FIND_ROOT)(e);
  var isRoot = false;
  if (root) {
    if (rootElement) {
      if (rootElement.indexOf('.') >= 0) {
        isRoot = rootElement === ".".concat(root.className);
      } else if (rootElement.indexOf('#') >= 0) {
        isRoot = rootElement === "#".concat(root.id);
      }
    }
  }
  if (isRoot) {
    var hasClassID = (0, _misc.CHECK_PARENT_HAS_CLASS)(e, exceptParentClassIDDataset);
    if (preventDefault && !hasClassID && e.cancelable && !e.defaultPrevented) {
      if (e.target instanceof Element) {
        var localName = e.target.localName;
        if (localName != 'input' && localName != 'button' && localName != 'select') {
          e.preventDefault();
        }
      }
    }
  }
};
var down = function down(e) {
  state.isPress = true;
  var x = e instanceof MouseEvent ? e.clientX : e.targetTouches[0].clientX || false;
  var y = e instanceof MouseEvent ? e.clientY : e.targetTouches[0].clientY || false;
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
  var x = e instanceof MouseEvent ? e.clientX : e.targetTouches[0].clientX || false;
  var y = e instanceof MouseEvent ? e.clientY : e.targetTouches[0].clientY || false;
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
var add = exports.add = function add(query, callback) {
  if (!callback) return;
  var type = query.slice(0, 1) === '.' ? '_class' : '_id';
  var name = query.slice(1);
  var key = name + type;
  dataset[String(key)] = callback;
};
var remove = exports.remove = function remove(query) {
  var type = query.slice(0, 1) == '.' ? '_class' : '_id';
  var name = query.slice(1);
  var key = name + type;
  delete dataset[key];
};
var install = exports.install = function install() {
  var app = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#app';
  rootElement = app;
  eventTransform();
  window.addEventListener('resize', eventTransform);
};
var clear = exports.clear = function clear() {
  exports.dataset = dataset = {};
};
var addPreventExcept = exports.addPreventExcept = function addPreventExcept(query) {
  if (Array.isArray(query)) {
    exceptParentClassIDDataset = (0, _toConsumableArray2["default"])(query);
  } else exceptParentClassIDDataset.push(query);
};
var setPreventDefault = exports.setPreventDefault = function setPreventDefault(value) {
  state.preventDefault = value;
};
var setEnabled = exports.setEnabled = function setEnabled(value) {
  state.enabled = value;
};
var Click = {
  install: install,
  dataset: dataset,
  addPreventExcept: addPreventExcept,
  setPreventDefault: setPreventDefault,
  add: add,
  clear: clear,
  remove: remove,
  setEnabled: setEnabled
};
var _default = exports["default"] = Click;