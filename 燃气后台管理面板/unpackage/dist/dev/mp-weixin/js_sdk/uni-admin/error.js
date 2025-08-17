"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const admin_config = require("../../admin.config.js");
function initError(app) {
  const debugOptions = admin_config.config.navBar.debug;
  if (debugOptions && debugOptions.enable === true) {
    const oldErrorHandler = app.config.errorHandler;
    app.config.errorHandler = function errorHandler(err, vm, info) {
      common_vendor.index.__f__("error", "at js_sdk/uni-admin/error.js:30", err);
      const route = vm.$page && vm.$page.route;
      store_index.store.dispatch("error/add", {
        err: err.toString(),
        info,
        route,
        time: (/* @__PURE__ */ new Date()).toLocaleTimeString()
      });
      return oldErrorHandler && oldErrorHandler(err, vm, info);
    };
  }
}
exports.initError = initError;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/js_sdk/uni-admin/error.js.map
