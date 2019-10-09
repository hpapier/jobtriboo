webpackHotUpdate("static/development/pages/index.js",{

/***/ "./components/home.js":
/*!****************************!*\
  !*** ./components/home.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _material_ui_lab__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/lab */ "./node_modules/@material-ui/lab/esm/index.js");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;




var Triboo = function Triboo(_ref) {
  var selected = _ref.selected,
      switchTriboo = _ref.switchTriboo,
      triboo = _ref.triboo;
  var triboos = triboo.map(function (item, index) {
    return __jsx(_material_ui_lab__WEBPACK_IMPORTED_MODULE_1__["ToggleButton"], {
      key: index,
      value: item
    }, item);
  });
  return __jsx(_material_ui_lab__WEBPACK_IMPORTED_MODULE_1__["ToggleButtonGroup"], {
    exclusive: true,
    onChange: function onChange(e, value) {
      return value !== null ? switchTriboo(value) : null;
    },
    size: "large",
    value: selected,
    style: {
      margin: 'auto',
      padding: 5
    }
  }, triboos);
};

var SampleData = function SampleData(_ref2) {
  var selected = _ref2.selected,
      data = _ref2.data;
  var sample = data.filter(function (item) {
    return item.triboo === selected;
  }).map(function (item, index) {
    return __jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__["Card"], {
      key: index,
      raised: true,
      style: {
        width: 500,
        margin: 10
      }
    }, __jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_2__["CardContent"], null, __jsx("h2", null, item.title), __jsx("h5", null, selected), __jsx("p", null, item.body)));
  });
  var sampleBox = {
    display: 'flex',
    flexWrap: 'wrap',
    width: 1050,
    margin: 'auto'
  };
  return __jsx("div", {
    style: sampleBox
  }, sample);
};

var Home = function Home(_ref3) {
  var data = _ref3.data;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])('commercial'),
      tribooSelected = _useState[0],
      setTribooSelected = _useState[1];

  return __jsx("div", null, __jsx("h1", null, "Join your triboo."), __jsx(Triboo, {
    selected: tribooSelected,
    switchTriboo: setTribooSelected,
    triboo: data.triboo
  }), __jsx(SampleData, {
    selected: tribooSelected,
    data: data.sample
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (Home);

/***/ })

})
//# sourceMappingURL=index.js.08e6e793cdfc245b0309.hot-update.js.map