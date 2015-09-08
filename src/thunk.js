'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

module.exports = function (fn) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return createThunk(fn, args);
};

var createThunk = function createThunk(fn, args) {
  var frozen = fn.__prevFrozen || (0, _clone2['default'])(args);
  var t = { fn: fn, args: args, frozen: frozen, type: 'Thunk' };
  t.render = render(t);
  return t;
};

var shouldUpdate = function shouldUpdate(current, previous) {
  if (!current || !previous || current.fn !== previous.fn) return true;
  var bool = (0, _deepEqual2['default'])(current.args, previous.frozen);
  current.fn.__prevFrozen = bool ? current.frozen : undefined;
  return !bool;
};

var render = function render(thunk) {
  return function (previous) {
    return shouldUpdate(thunk, previous) ? thunk.fn.apply(null, thunk.args) : previous.vnode;
  };
};