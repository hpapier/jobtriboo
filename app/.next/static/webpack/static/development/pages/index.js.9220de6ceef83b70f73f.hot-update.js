webpackHotUpdate("static/development/pages/index.js",{

/***/ "./components/header.js":
/*!******************************!*\
  !*** ./components/header.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime-corejs2/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./i18n */ "./components/i18n.js");
/* harmony import */ var _i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");
/* harmony import */ var _store_container_modalConnexion__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../store/container/modalConnexion */ "./store/container/modalConnexion.js");
/* harmony import */ var _utils_lang__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/lang */ "./utils/lang.js");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! next/router */ "./node_modules/next/dist/client/router.js");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _language__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./language */ "./components/language.js");
/* harmony import */ var react_cookie__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-cookie */ "./node_modules/react-cookie/es6/index.js");

var __jsx = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement;


 // import { checkAuth } from '../utils/auth'






/* Header style (need to move) */

var headerLayoutStyle = {
  // backgroundColor: '#fb9e91',
  // backgroundColor: '#90aeff',
  background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .30)',
  width: '100%',
  height: '60px',
  display: 'flex',
  justifyContent: 'space-between'
};
var headerBtnStyle = {
  borderLeft: "1px solid rgba(0, 0, 0, 0.05)",
  margin: "0px",
  borderRadius: 0,
  height: '100%',
  color: "white",
  padding: '0px 40px',
  // backgroundColor: '#87e5da'
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'

};
var headerLogo = {
  color: '#FFF',
  width: 300,
  height: '65px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '2em',
  textTransform: 'uppercase',
  fontWeight: '600',
  // fontStyle: 'italic',
  textShadow: '2px 2px rgba(0, 0, 0, 0.2)'
  /* Component */

};

var HeaderLayout = function HeaderLayout(props) {
  return __jsx("div", {
    style: headerLayoutStyle
  }, props.children);
};

var JobTribooLogo = function JobTribooLogo() {
  var router = Object(next_router__WEBPACK_IMPORTED_MODULE_6__["useRouter"])();
  return __jsx("div", {
    style: headerLogo,
    onClick: function onClick() {
      return router.pathname !== '/' ? router.push('/') : null;
    }
  }, "JobTriboo");
};

var HeaderOnline = function HeaderOnline(_ref) {
  var t = _ref.t,
      setLoginState = _ref.setLoginState;

  var _useCookies = Object(react_cookie__WEBPACK_IMPORTED_MODULE_8__["useCookies"])(),
      _useCookies2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useCookies, 3),
      cookies = _useCookies2[0],
      setCookies = _useCookies2[1],
      removeCookies = _useCookies2[2];

  var router = Object(next_router__WEBPACK_IMPORTED_MODULE_6__["useRouter"])();

  var handleLogout = function handleLogout() {
    console.log('LOGOUT');
    removeCookies('token');
    setLoginState(false);
  };

  return __jsx(HeaderLayout, null, __jsx("div", null, __jsx(JobTribooLogo, null)), __jsx("div", null, __jsx(_language__WEBPACK_IMPORTED_MODULE_7__["default"], null), __jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__["Button"], {
    style: headerBtnStyle,
    onClick: function onClick() {
      return router.push('/dashboard');
    }
  }, t('dashboard')), __jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__["Button"], {
    style: headerBtnStyle
  }, t('settings')), __jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__["Button"], {
    style: headerBtnStyle,
    onClick: handleLogout
  }, t('logout'))));
};

var HeaderOffline = function HeaderOffline(_ref2) {
  var t = _ref2.t;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(false),
      modalOpen = _useState[0],
      setModalOpenState = _useState[1];

  var _useState2 = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(false),
      modalWindowLogin = _useState2[0],
      setMWindowLogin = _useState2[1];

  var openModalMechanism = function openModalMechanism(modalWindowState) {
    setModalOpenState(true);
    setMWindowLogin(modalWindowState);
  };

  return __jsx(HeaderLayout, null, __jsx("div", null, __jsx(JobTribooLogo, null)), __jsx("div", null, __jsx(_language__WEBPACK_IMPORTED_MODULE_7__["default"], null), __jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__["Button"], {
    style: headerBtnStyle,
    onClick: function onClick() {
      return openModalMechanism(true);
    }
  }, t('login')), __jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__["Button"], {
    style: headerBtnStyle,
    onClick: function onClick() {
      return openModalMechanism(false);
    }
  }, t('register'))), __jsx(_store_container_modalConnexion__WEBPACK_IMPORTED_MODULE_4__["default"], {
    setModalOpenState: setModalOpenState,
    setMWindowLogin: setMWindowLogin,
    modalWindowLogin: modalWindowLogin,
    modalOpen: modalOpen
  }));
};

var Header = function Header(_ref3) {
  var isLoggedIn = _ref3.isLoggedIn,
      t = _ref3.t,
      setLoginState = _ref3.setLoginState,
      loginState = _ref3.loginState;

  var _useCookies3 = Object(react_cookie__WEBPACK_IMPORTED_MODULE_8__["useCookies"])(),
      _useCookies4 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useCookies3, 1),
      cookies = _useCookies4[0];

  var router = Object(next_router__WEBPACK_IMPORTED_MODULE_6__["useRouter"])();
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(function () {
    if (isLoggedIn !== undefined && cookies.token === undefined) {
      setLoginState(false);
      if (router.pathname === '/settings') router.push('/');
    } else if (isLoggedIn !== undefined && !loginState) {
      setLoginState(isLoggedIn);
      if (!isLoggedIn && router.pathname === '/settings') router.push('/');
    }

    console.log(isLoggedIn, loginState);
  });
  return loginState ? __jsx(HeaderOnline, {
    t: t,
    setLoginState: setLoginState
  }) : __jsx(HeaderOffline, {
    t: t
  });
};

/* harmony default export */ __webpack_exports__["default"] = (Object(_i18n__WEBPACK_IMPORTED_MODULE_2__["withTranslation"])('common')(Header));

/***/ })

})
//# sourceMappingURL=index.js.9220de6ceef83b70f73f.hot-update.js.map