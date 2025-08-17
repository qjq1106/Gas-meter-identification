"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../store/index.js");
common_vendor.tr.database();
function request(action, params, options) {
  const { objectName, functionName, showModal, ...objectOptions } = Object.assign({
    objectName: "uni-id-co",
    functionName: "",
    showModal: false,
    customUI: true,
    loadingOptions: {
      title: "xxx"
    }
  }, options);
  let call;
  if (functionName) {
    call = common_vendor.tr.callFunction({
      name: functionName,
      data: {
        action,
        params
      }
    });
  } else {
    const uniCloudObject = common_vendor.tr.importObject(objectName, objectOptions);
    call = uniCloudObject[action](params);
  }
  return call.then((result) => {
    result = functionName ? result.result : result;
    if (!result) {
      return Promise.resolve(result);
    }
    if (result.errCode) {
      return Promise.reject(result);
    }
    return Promise.resolve(result);
  }).catch((err) => {
    showModal && common_vendor.index.showModal({
      content: err.errMsg || "请求服务失败",
      showCancel: false
    });
    return Promise.reject(err);
  });
}
function initRequest(app) {
  app.config.globalProperties.$request = request;
}
exports.initRequest = initRequest;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/js_sdk/uni-admin/request.js.map
