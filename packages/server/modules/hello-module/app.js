"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render(_ref) {
  var name = _ref.name;
  return /*#__PURE__*/_react.default.createElement("h1", null, "Hello world from the render ", name);
}