webpackHotUpdate("static/development/pages/index.js",{

/***/ "./components/language.js":
/*!********************************!*\
  !*** ./components/language.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime-corejs2/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_lang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/lang */ "./utils/lang.js");
/* harmony import */ var _i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./i18n */ "./components/i18n.js");
/* harmony import */ var _i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");
/* harmony import */ var react_cookie__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-cookie */ "./node_modules/react-cookie/es6/index.js");

var __jsx = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement;





var languageBtnStyle = {
  width: 80
};
var languageItemStyle = {
  'selected': {
    backgroundColor: 'red'
  }
};

var LangBtn = function LangBtn() {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])('en'),
      selectedLanguage = _useState[0],
      setSelectedLanguage = _useState[1];

  var _useCookies = Object(react_cookie__WEBPACK_IMPORTED_MODULE_5__["useCookies"])(['next-i18next']),
      _useCookies2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useCookies, 3),
      cookies = _useCookies2[0],
      setCookies = _useCookies2[1],
      removeCookies = _useCookies2[2];

  var prefLang = cookies['next-i18next'] === undefined ? 'en' : cookies['next-i18next'];
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(function () {
    setSelectedLanguage(prefLang);
  }, []);

  var languagesSwitch = function languagesSwitch(e) {
    _i18n__WEBPACK_IMPORTED_MODULE_3__["i18n"].changeLanguage(e.target.value);
    setSelectedLanguage(e.target.value);
  };

  return __jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__["FormControl"], {
    style: languageBtnStyle
  }, __jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__["Select"], {
    value: selectedLanguage,
    style: {
      color: '#fff',
      textTransform: 'capitalize',
      height: '60px',
      minWidth: 50
    },
    onChange: languagesSwitch,
    variant: "filled"
  }, _utils_lang__WEBPACK_IMPORTED_MODULE_2__["languages"].map(function (item, index) {
    return __jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__["MenuItem"], {
      key: index,
      value: item
    }, item);
  })));
};

/* harmony default export */ __webpack_exports__["default"] = (LangBtn);

/***/ })

})
//# sourceMappingURL=index.js.07c9e5ac855a9358a06e.hot-update.js.map