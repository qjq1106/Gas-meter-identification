"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_uniIdPermissions = require("../../../js_sdk/validator/uni-id-permissions.js");
const db = common_vendor.tr.database();
db.command;
const dbCollectionName = "uni-id-permissions";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_uniIdPermissions.validator) {
    if (fields.includes(key)) {
      result[key] = js_sdk_validator_uniIdPermissions.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    let formData = {
      "permission_id": "",
      "permission_name": "",
      "comment": ""
    };
    return {
      formData,
      formOptions: {},
      rules: {
        ...getValidator(Object.keys(formData))
      }
    };
  },
  onReady() {
    this.$refs.form.setRules(this.rules);
  },
  methods: {
    /**
     * 触发表单提交
     */
    submit() {
      common_vendor.index.showLoading({
        mask: true
      });
      this.$refs.form.validate().then((res) => {
        this.submitForm(res);
      }).catch(() => {
        common_vendor.index.hideLoading();
      });
    },
    submitForm(value) {
      db.collection(dbCollectionName).add(value).then((res) => {
        common_vendor.index.showToast({
          title: "新增成功"
        });
        this.getOpenerEventChannel().emit("refreshData");
        setTimeout(() => common_vendor.index.navigateBack(), 500);
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "请求服务失败",
          showCancel: false
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_forms_item2 + _easycom_uni_forms2)();
}
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_forms_item + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o([($event) => $data.formData.permission_id = $event.detail.value, ($event) => _ctx.binddata("permission_id", $event.detail.value)]),
    b: $data.formData.permission_id,
    c: common_vendor.p({
      name: "permission_id",
      label: "权限ID",
      required: true
    }),
    d: common_vendor.o([($event) => $data.formData.permission_name = $event.detail.value, ($event) => _ctx.binddata("permission_name", $event.detail.value)]),
    e: $data.formData.permission_name,
    f: common_vendor.p({
      name: "permission_name",
      label: "权限名称",
      required: true
    }),
    g: common_vendor.o([($event) => $data.formData.comment = $event.detail.value, ($event) => _ctx.binddata("comment", $event.detail.value)]),
    h: $data.formData.comment,
    i: common_vendor.p({
      name: "comment",
      label: "备注"
    }),
    j: common_vendor.t(_ctx.$t("common.button.submit")),
    k: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    l: common_vendor.t(_ctx.$t("common.button.back")),
    m: common_vendor.sr("form", "a15adb32-0"),
    n: common_vendor.p({
      value: $data.formData,
      validateTrigger: "bind"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/system/permission/add.js.map
