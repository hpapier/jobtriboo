webpackHotUpdate("static/development/pages/dashboard.js",{

/***/ "./pages/dashboard.js":
/*!****************************!*\
  !*** ./pages/dashboard.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");
/* harmony import */ var _material_ui_icons_Add__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @material-ui/icons/Add */ "./node_modules/@material-ui/icons/Add.js");
/* harmony import */ var _material_ui_icons_Add__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_Add__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _material_ui_icons_Clear__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @material-ui/icons/Clear */ "./node_modules/@material-ui/icons/Clear.js");
/* harmony import */ var _material_ui_icons_Clear__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_Clear__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _store_container_header__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../store/container/header */ "./store/container/header.js");
/* harmony import */ var _utils_auth__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/auth */ "./utils/auth.js");


var __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;







var DashboardBody = function DashboardBody() {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(false),
      announceToolStatus = _useState[0],
      setAnnounceToolStatus = _useState[1];

  return __jsx("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      width: '500px',
      margin: 'auto'
    }
  }, __jsx("div", {
    style: {
      width: 500,
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 50
    }
  }, __jsx("h3", null, "No announces yet"), __jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__["Button"], {
    variant: "contained",
    style: {
      backgroundColor: announceToolStatus ? '#ff4d4d' : '#4ecca3'
    },
    onClick: function onClick() {
      return setAnnounceToolStatus(!announceToolStatus);
    }
  }, "Create new announce", !announceToolStatus ? __jsx(_material_ui_icons_Add__WEBPACK_IMPORTED_MODULE_4___default.a, null) : __jsx(_material_ui_icons_Clear__WEBPACK_IMPORTED_MODULE_5___default.a, null))), announceToolStatus ? __jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__["Card"], null, __jsx(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__["TextField"], {
    variant: "outlined",
    label: "Title"
  })) : null);
};

var Dashboard = function Dashboard(_ref) {
  var isLoggedIn = _ref.isLoggedIn;
  return __jsx("div", null, __jsx(_store_container_header__WEBPACK_IMPORTED_MODULE_6__["default"], {
    isLoggedIn: isLoggedIn
  }), __jsx(DashboardBody, null));
};

Dashboard.getInitialProps =
/*#__PURE__*/
function () {
  var _ref2 = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(ctx) {
    var isLoggedIn;
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Object(_utils_auth__WEBPACK_IMPORTED_MODULE_7__["checkAuth"])(ctx);

          case 2:
            isLoggedIn = _context.sent;
            return _context.abrupt("return", {
              isLoggedIn: isLoggedIn,
              namespacesRequired: ['common']
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

/* harmony default export */ __webpack_exports__["default"] = (Dashboard);

/***/ })

})
//# sourceMappingURL=dashboard.js.10081a02f8df10a34a5f.hot-update.js.map