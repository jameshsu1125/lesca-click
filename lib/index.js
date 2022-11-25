var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
define(["require", "exports", "./constants"], function (require, exports, constants_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setEnabled = exports.setPreventDefault = exports.addPreventExcept = exports.clear = exports.install = exports.remove = exports.add = exports.dataset = void 0;
    exports.dataset = {};
    var mousePropertyDown = { x: 0, y: 0 };
    var mousePropertyMove = { x: mousePropertyDown.x, y: mousePropertyDown.y };
    var moveOffsetProperty = { x: 0, y: 0 };
    var extraEvent = {
        down: function (e) { },
        move: function (e) { },
        up: function (e) { },
    };
    var state = { device: '', isPress: false, deviation: 30, preventDefault: true, enabled: true };
    var eventProperty = { passive: false, capture: false };
    var exceptParentClassIDDataset = [];
    var rootElement = '';
    var checkDataset = function (e) {
        var target = e.target;
        if (target) {
            if (target instanceof Element) {
                ["".concat(target.id, "_id"), "".concat(target.className, "_class")].forEach(function (name) {
                    var _a;
                    (_a = exports.dataset[name]) === null || _a === void 0 ? void 0 : _a.call(exports.dataset, e);
                });
            }
        }
    };
    var eventTransform = function () {
        var device = state.device;
        var d = (0, constants_1.GET_DEVICE)();
        if (!device) {
            state.device = d;
            addListener(d);
        }
        else if (device !== d) {
            state.device = d;
            removeListener(d);
            addListener(d);
        }
    };
    var areWePreventDefault = function (e) {
        var preventDefault = state.preventDefault, enabled = state.enabled;
        if (!enabled)
            return;
        var root = (0, constants_1.FIND_ROOT)(e);
        var isRoot = false;
        if (root) {
            if (rootElement) {
                if (rootElement.indexOf('.') >= 0) {
                    isRoot = rootElement === ".".concat(root.className);
                }
                else if (rootElement.indexOf('#') >= 0) {
                    isRoot = rootElement === "#".concat(root.id);
                }
            }
        }
        if (isRoot) {
            var hasClassID = (0, constants_1.CHECK_PARENT_HAS_CLASS)(e, exceptParentClassIDDataset);
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
    var down = function (e) {
        state.isPress = true;
        var x = e instanceof MouseEvent ? e.clientX : e.targetTouches[0].clientX || false;
        var y = e instanceof MouseEvent ? e.clientY : e.targetTouches[0].clientY || false;
        if (!x || !y)
            return;
        areWePreventDefault(e);
        mousePropertyDown.x = x;
        mousePropertyDown.y = y;
        mousePropertyMove.x = x;
        mousePropertyMove.y = y;
        extraEvent.down(e);
    };
    var move = function (e) {
        if (!state.isPress)
            return;
        var x = e instanceof MouseEvent ? e.clientX : e.targetTouches[0].clientX || false;
        var y = e instanceof MouseEvent ? e.clientY : e.targetTouches[0].clientY || false;
        if (!x || !y)
            return;
        areWePreventDefault(e);
        var dx = mousePropertyDown.x, dy = mousePropertyDown.y;
        moveOffsetProperty.x = x - dx;
        moveOffsetProperty.y = y - dy;
        mousePropertyMove.x = x;
        mousePropertyMove.y = y;
        extraEvent.move(__assign(__assign({}, e), { moveOffsetProperty: moveOffsetProperty }));
    };
    var up = function (e) {
        state.isPress = false;
        var dx = mousePropertyDown.x, dy = mousePropertyDown.y;
        var mx = mousePropertyMove.x, my = mousePropertyMove.y;
        var deviation = state.deviation;
        var m = Math.sqrt(Math.pow((mx - dx), 2) + Math.pow((my - dy), 2));
        if (m < deviation)
            checkDataset(e);
        extraEvent.up(e);
    };
    var addListener = function (device) {
        if (device === 'mobile') {
            document.addEventListener('touchstart', down, eventProperty);
            document.addEventListener('touchmove', move, eventProperty);
            document.addEventListener('touchend', up);
        }
        else {
            document.addEventListener('mousedown', down);
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        }
    };
    var removeListener = function (device) {
        if (device === 'mobile') {
            document.removeEventListener('mousedown', down);
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
        }
        else {
            document.removeEventListener('touchstart', down);
            document.removeEventListener('touchmove', move);
            document.removeEventListener('touchend', up);
        }
    };
    var add = function (query, callback) {
        if (!callback)
            return;
        var type = query.slice(0, 1) === '.' ? '_class' : '_id';
        var name = query.slice(1);
        var key = name + type;
        exports.dataset[String(key)] = callback;
    };
    exports.add = add;
    var remove = function (query) {
        var type = query.slice(0, 1) == '.' ? '_class' : '_id';
        var name = query.slice(1);
        var key = name + type;
        delete exports.dataset[key];
    };
    exports.remove = remove;
    var install = function (app) {
        if (app === void 0) { app = '#app'; }
        rootElement = app;
        eventTransform();
        window.addEventListener('resize', eventTransform);
    };
    exports.install = install;
    var clear = function () {
        exports.dataset = {};
    };
    exports.clear = clear;
    var addPreventExcept = function (query) {
        if (Array.isArray(query)) {
            exceptParentClassIDDataset = __spreadArray([], query, true);
        }
        else
            exceptParentClassIDDataset.push(query);
    };
    exports.addPreventExcept = addPreventExcept;
    var setPreventDefault = function (value) {
        state.preventDefault = value;
    };
    exports.setPreventDefault = setPreventDefault;
    var setEnabled = function (value) {
        state.enabled = value;
    };
    exports.setEnabled = setEnabled;
    var Click = {
        install: exports.install,
        dataset: exports.dataset,
        addPreventExcept: exports.addPreventExcept,
        setPreventDefault: exports.setPreventDefault,
        add: exports.add,
        clear: exports.clear,
        remove: exports.remove,
        setEnabled: exports.setEnabled,
    };
    exports.default = Click;
});
