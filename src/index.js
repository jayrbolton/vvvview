'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _virtualDomCreateElement = require('virtual-dom/create-element');

var _virtualDomCreateElement2 = _interopRequireDefault(_virtualDomCreateElement);

var _virtualDomH = require('virtual-dom/h');

var _virtualDomH2 = _interopRequireDefault(_virtualDomH);

var _virtualDomPatch = require('virtual-dom/patch');

var _virtualDomPatch2 = _interopRequireDefault(_virtualDomPatch);

var _virtualDomDiff = require('virtual-dom/diff');

var _virtualDomDiff2 = _interopRequireDefault(_virtualDomDiff);

var _flyd = require('flyd');

var _flyd2 = _interopRequireDefault(_flyd);

var _thunk = require('./thunk');

var _thunk2 = _interopRequireDefault(_thunk);

var _fjCurry = require('fj-curry');

var api = { h: _virtualDomH2['default'], flyd: _flyd2['default'], partial: _thunk2['default'] };

module.exports = api;

// Create an object literal that contains all the data for view re-rendering and a state stream
api.createView = (0, _fjCurry.curryN)(3, function (parentNode, rootComponent, initialState) {
  var view = { rootComponent: rootComponent, streams: {}, state: initialState };
  view.tree = rootComponent(view.state);
  view.rootNode = (0, _virtualDomCreateElement2['default'])(view.tree);
  parentNode.appendChild(view.rootNode);
  return view;
});

// Given some streams, combine it into a view's state stream using a combinator.
// This allows you to compose any number of arbitrary streams into the view's
// main state stream so that the dom gets rerendered automatically.
api.combineState = (0, _fjCurry.curryN)(3, function (combinator, view, stream) {
  if (stream.length) stream = stream.reduce(function (acc, s) {
    return _flyd2['default'].merge(acc, s);
  });
  return _flyd2['default'].stream([stream], function (n, changes) {
    view.state = combinator.apply(null, [view.state, stream()]);
    render(view, view.state);
    return view.state;
  });
});

// Render a virtual dom tree given a view and a state, returns the state
var render = (0, _fjCurry.curryN)(2, function (view, state) {
  if (view.sync) view.sync(state);
  var newTree = view.rootComponent(state);
  var patches = (0, _virtualDomDiff2['default'])(view.tree, newTree);
  view.rootNode = (0, _virtualDomPatch2['default'])(view.rootNode, patches);
  view.tree = newTree;
  return state;
});