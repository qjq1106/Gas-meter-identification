"use strict";
const common_vendor = require("../../common/vendor.js");
const db = common_vendor.tr.database();
const dbCollectionName = "report";
const _sfc_main = {
  data() {
    return {
      formData: {
        reading: "",
        lastReading: "",
        integerPart: "",
        decimalPart: "",
        address: "",
        building: "",
        date: "",
        time: "",
        status: "已识别",
        remark: "",
        imageUrl: []
      },
      rules: {
        reading: {
          rules: [{
            required: true,
            errorMessage: "读数不能为空"
          }]
        },
        address: {
          rules: [{
            required: true,
            errorMessage: "地址不能为空"
          }]
        },
        date: {
          rules: [{
            required: true,
            errorMessage: "日期不能为空"
          }]
        },
        imageUrl: {
          rules: [{
            required: true,
            errorMessage: "图片不能为空"
          }]
        }
      },
      buildingOptions: [
        { value: "1号楼", text: "1号楼" },
        { value: "2号楼", text: "2号楼" },
        { value: "3号楼", text: "3号楼" },
        { value: "4号楼", text: "4号楼" },
        { value: "5号楼", text: "5号楼" },
        { value: "6号楼", text: "6号楼" },
        { value: "7号楼", text: "7号楼" },
        { value: "8号楼", text: "8号楼" },
        { value: "9号楼", text: "9号楼" },
        { value: "10号楼", text: "10号楼" },
        { value: "11号楼", text: "11号楼" },
        { value: "12号楼", text: "12号楼" }
      ],
      statusOptions: [
        { value: "已识别", text: "已识别" },
        { value: "已确认", text: "已确认" },
        { value: "待审核", text: "待审核" },
        { value: "异常", text: "异常" }
      ],
      recordId: ""
    };
  },
  async onLoad(options) {
    if (options.id) {
      this.recordId = options.id;
      await this.loadData();
    }
  },
  methods: {
    async loadData() {
      try {
        const res = await db.collection(dbCollectionName).doc(this.recordId).get();
        if (res.data.data && res.data.data.length > 0) {
          const data = res.data.data[0];
          this.formData = {
            reading: data.reading || "",
            lastReading: data.lastReading || "",
            integerPart: data.integerPart || "",
            decimalPart: data.decimalPart || "",
            address: data.address || "",
            building: data.building || "",
            date: data.date || "",
            time: data.time || "",
            status: data.status || "已识别",
            remark: data.remark || "",
            imageUrl: data.imageUrl && data.imageUrl.trim() ? [data.imageUrl] : []
          };
        }
      } catch (err) {
        common_vendor.index.$u.toast("加载数据失败");
        common_vendor.index.__f__("error", "at pages/report/edit.vue:180", err);
      }
    },
    async submit() {
      try {
        const isValid = await this.$refs.form.validate();
        if (!isValid)
          return;
        let imageUrl = "";
        if (this.formData.imageUrl && this.formData.imageUrl.length > 0) {
          imageUrl = this.formData.imageUrl[0].url || this.formData.imageUrl[0];
        }
        const data = {
          ...this.formData,
          imageUrl,
          updateTime: /* @__PURE__ */ new Date()
        };
        const res = await db.collection(dbCollectionName).doc(this.recordId).update(data);
        if (res.data.updated > 0) {
          common_vendor.index.$u.toast("更新成功");
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }
      } catch (err) {
        common_vendor.index.$u.toast("更新失败");
        common_vendor.index.__f__("error", "at pages/report/edit.vue:211", err);
      }
    },
    cancel() {
      common_vendor.index.navigateBack();
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_file_picker2 = common_vendor.resolveComponent("uni-file-picker");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_select2 + _easycom_uni_datetime_picker2 + _easycom_uni_file_picker2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_file_picker = () => "../../uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_select + _easycom_uni_datetime_picker + _easycom_uni_file_picker + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.formData.reading = $event),
    b: common_vendor.p({
      placeholder: "请输入当前读数",
      modelValue: $data.formData.reading
    }),
    c: common_vendor.p({
      label: "当前读数",
      name: "reading",
      required: true
    }),
    d: common_vendor.o(($event) => $data.formData.lastReading = $event),
    e: common_vendor.p({
      placeholder: "请输入上次读数",
      modelValue: $data.formData.lastReading
    }),
    f: common_vendor.p({
      label: "上次读数",
      name: "lastReading"
    }),
    g: common_vendor.o(($event) => $data.formData.integerPart = $event),
    h: common_vendor.p({
      placeholder: "请输入整数部分",
      modelValue: $data.formData.integerPart
    }),
    i: common_vendor.p({
      label: "整数部分",
      name: "integerPart"
    }),
    j: common_vendor.o(($event) => $data.formData.decimalPart = $event),
    k: common_vendor.p({
      placeholder: "请输入小数部分",
      modelValue: $data.formData.decimalPart
    }),
    l: common_vendor.p({
      label: "小数部分",
      name: "decimalPart"
    }),
    m: common_vendor.o(($event) => $data.formData.address = $event),
    n: common_vendor.p({
      placeholder: "请输入详细地址",
      modelValue: $data.formData.address
    }),
    o: common_vendor.p({
      label: "详细地址",
      name: "address",
      required: true
    }),
    p: common_vendor.o(($event) => $data.formData.building = $event),
    q: common_vendor.p({
      localdata: $data.buildingOptions,
      placeholder: "请选择楼栋号",
      modelValue: $data.formData.building
    }),
    r: common_vendor.p({
      label: "楼栋号",
      name: "building"
    }),
    s: common_vendor.o(($event) => $data.formData.date = $event),
    t: common_vendor.p({
      type: "date",
      placeholder: "请选择抄表日期",
      modelValue: $data.formData.date
    }),
    v: common_vendor.p({
      label: "抄表日期",
      name: "date",
      required: true
    }),
    w: common_vendor.o(($event) => $data.formData.time = $event),
    x: common_vendor.p({
      type: "time",
      placeholder: "请选择抄表时间",
      modelValue: $data.formData.time
    }),
    y: common_vendor.p({
      label: "抄表时间",
      name: "time"
    }),
    z: common_vendor.o(($event) => $data.formData.status = $event),
    A: common_vendor.p({
      localdata: $data.statusOptions,
      placeholder: "请选择报告状态",
      modelValue: $data.formData.status
    }),
    B: common_vendor.p({
      label: "报告状态",
      name: "status"
    }),
    C: common_vendor.o(($event) => $data.formData.remark = $event),
    D: common_vendor.p({
      type: "textarea",
      placeholder: "请输入备注信息",
      maxlength: 200,
      modelValue: $data.formData.remark
    }),
    E: common_vendor.p({
      label: "备注信息",
      name: "remark"
    }),
    F: common_vendor.o(($event) => $data.formData.imageUrl = $event),
    G: common_vendor.p({
      ["file-mediatype"]: "image",
      mode: "grid",
      limit: 1,
      ["auto-upload"]: true,
      modelValue: $data.formData.imageUrl
    }),
    H: common_vendor.p({
      label: "燃气表图片",
      name: "imageUrl",
      required: true
    }),
    I: common_vendor.sr("form", "5c2e0bab-0"),
    J: common_vendor.p({
      model: $data.formData,
      rules: $data.rules,
      ["validate-trigger"]: "submit",
      ["err-show-type"]: "toast"
    }),
    K: common_vendor.o((...args) => $options.cancel && $options.cancel(...args)),
    L: common_vendor.o((...args) => $options.submit && $options.submit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/report/edit.js.map
