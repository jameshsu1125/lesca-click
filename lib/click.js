"use strict";

module.exports = {
  preventDefault: true,
  db: {},
  deviation: 30,
  init: function init() {
    var _this = this;

    var clickEventAlso = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var install = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var ex_down = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
    var ex_move = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};
    var ex_up = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function () {};
    this.px = this.mx = 0;
    this.py = this.my = 0;
    this.dx = this.dy = 0;
    this.ex_down = ex_down;
    this.ex_move = ex_move;
    this.ex_up = ex_up;
    this.is_press = false;

    this.down = function (e) {
      var n = e.target.localName;

      if (_this.preventDefault) {
        if (e.cancelable) {
          if (!e.defaultPrevented) {
            if (n != 'input' && n != 'button' && n != 'select') e.preventDefault();

            try {
              _this.px = _this.mx = e.clientX || e.targetTouches[0].clientX;
              _this.py = _this.my = e.clientY || e.targetTouches[0].clientY;
            } catch (_unused) {}
          }
        }
      }

      _this.ex_down(e);

      _this.is_press = true;
    };

    this.move = function (e) {
      if (!_this.is_press) return;
      var n = e.target.localName;

      if (_this.preventDefault) {
        if (e.cancelable) {
          if (!e.defaultPrevented) {
            if (n != 'input' && n != 'button' && n != 'select') e.preventDefault();

            try {
              _this.px = e.clientX || e.targetTouches[0].clientX;
              _this.py = e.clientY || e.targetTouches[0].clientY;
              _this.dx = _this.px - _this.mx;
              _this.dy = _this.py - _this.my;
            } catch (_unused2) {}
          }
        }
      }

      _this.ex_move(e);
    };

    this.up = function (e) {
      if (Math.abs(_this.px - _this.mx) < _this.deviation && Math.abs(_this.py - _this.my) < _this.deviation) {
        _this.get(e);
      }

      _this.is_press = false;

      _this.ex_up(e);
    };

    document.addEventListener('touchstart', this.down, {
      passive: false,
      capture: false
    });
    document.addEventListener('touchmove', this.move, {
      passive: false,
      capture: false
    });
    document.addEventListener('touchend', this.up);

    if (clickEventAlso) {
      document.addEventListener('mousedown', this.down);
      document.addEventListener('mousemove', this.move);
      document.addEventListener('mouseup', this.up);
    }

    if (install) window.Click = window.Click || this;
  },
  get: function get(e) {
    var key = e.target.id + '_id';

    if (this.db[key]) {
      this.db[key](e);
      return;
    }

    key = e.target.className + '_class';

    if (this.db[key]) {
      this.db[key](e);
      return;
    }
  },
  add: function add(query, fn) {
    if (!fn) console.log('require callback function');
    var type = query.slice(0, 1) == '.' ? '_class' : '_id';
    var name = query.slice(1);
    var key = name + type;
    this.db[key] = fn;
  },
  remove: function remove(query) {
    var type = query.slice(0, 1) == '.' ? '_class' : '_id';
    var name = query.slice(1);
    var key = name + type;
    delete this.db[key];
  },
  clear: function clear() {
    this.db = {};
  },
  destory: function destory() {
    document.removeEventListener('touchstart', this.down);
    document.removeEventListener('touchmove', this.move);
    document.removeEventListener('touchend', this.up);

    if (clickEventAlso) {
      document.removeEventListener('mousedown', this.down);
      document.removeEventListener('mousemove', this.move);
      document.removeEventListener('mouseup', this.up);
    }
  }
};