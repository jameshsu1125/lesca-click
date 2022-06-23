var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "mobile-detect"], function (require, exports, mobile_detect_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FIND_ROOT = exports.CHECK_PARENT_HAS_CLASS = exports.GET_DEVICE = void 0;
    mobile_detect_1 = __importDefault(mobile_detect_1);
    var GET_DEVICE = function () {
        var m = new mobile_detect_1.default(window.navigator.userAgent);
        if (m.tablet())
            return 'mobile';
        else if (m.mobile())
            return 'mobile';
        else
            return 'desktop';
    };
    exports.GET_DEVICE = GET_DEVICE;
    var CHECK_PARENT_HAS_CLASS = function (e, classDataset) {
        var target = e.target;
        var node = target;
        var result = [];
        var _loop_1 = function () {
            var id = node.id, className = node.className;
            var is = classDataset.filter(function (e) {
                var attr = e.slice(0, 1);
                var name = e.slice(1);
                switch (attr) {
                    case '.':
                        if (className === name)
                            return true;
                        break;
                    case '#':
                        if (id === name)
                            return true;
                        break;
                }
                return false;
            }).length > 0;
            if (is)
                result.push(node);
            node = node.parentNode;
        };
        while (node && node.tagName !== 'HTML') {
            _loop_1();
        }
        return result.length > 0;
    };
    exports.CHECK_PARENT_HAS_CLASS = CHECK_PARENT_HAS_CLASS;
    var FIND_ROOT = function (e) {
        var target = e.target;
        var node = target;
        var result;
        while (node && node.tagName !== 'BODY') {
            result = node;
            node = node.parentNode;
        }
        return result;
    };
    exports.FIND_ROOT = FIND_ROOT;
});
