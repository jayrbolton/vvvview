"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _virtualDomCreateElement = require('virtual-dom/create-element');

var _virtualDomCreateElement2 = _interopRequireDefault(_virtualDomCreateElement);

var _virtualDomPatch = require('virtual-dom/patch');

var _virtualDomPatch2 = _interopRequireDefault(_virtualDomPatch);

var _virtualDomDiff = require('virtual-dom/diff');

var _virtualDomDiff2 = _interopRequireDefault(_virtualDomDiff);

var _fjCurry = require('fj-curry');

var view = (0, _fjCurry.curryN)(3, function (rootFn, parentNode, state) {
  var view = { root: rootFn, tree: rootFn(state) };
  view.rootNode = (0, _virtualDomCreateElement2['default'])(view.tree);
  parentNode.appendChild(view.rootNode);
  return rerender(view);
});

var rerender = (0, _fjCurry.curryN)(2, function (view, newState) {
  var newTree = view.root(newState);
  var patches = (0, _virtualDomDiff2['default'])(view.tree, newTree);
  view.rootNode = (0, _virtualDomPatch2['default'])(view.rootNode, patches);
  view.tree = newTree;
  return newState;
});

module.exports = view;