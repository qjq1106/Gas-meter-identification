"use strict";
const common_vendor = require("../../../common/vendor.js");
const pages_system_app_mixin_publish_add_detail_mixin = require("./mixin/publish_add_detail_mixin.js");
const db = common_vendor.tr.database();
db.command;
const dbCollectionName = "opendb-app-list";
function randomString(len) {
  let array = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  ];
  let result = "";
  for (let i = 0; i < len; i++) {
    result += array[Math.floor(Math.random() * 26)];
  }
  return result;
}
const _sfc_main = {
  // mixins 导入 mixin
  mixins: [pages_system_app_mixin_publish_add_detail_mixin.mixin],
  // 组件的数据对象
  data() {
    return {
      // 额外数据，初始化为空字符串
      mpExtra: " ",
      // 手风琴状态，默认为1
      mpAccordionStatus: 1,
      // 标签宽度，默认为'80px'
      labelWidth: "80px",
      uniFilePickerProvider: "unicloud",
      // 应用类型选项
      appTypeOptions: [
        { value: 0, text: "uni-app" },
        { value: 1, text: "uni-app x" }
      ]
    };
  },
  /**
   * 页面加载时的处理函数
   * @param {object} e - 传入的参数对象
   */
  onLoad(e) {
    if (e.id) {
      this.isEdit = true;
      common_vendor.index.setNavigationBarTitle({
        title: "修改应用"
      });
      this.setFormData("appid", e.id);
      this.getDetail(e.id);
    } else {
      this.$watch("formData.name", (name) => {
        this.platFormKeys.forEach((key) => {
          this.setFormData(`${key}.name`, name);
        });
      });
    }
  },
  onReady() {
    this.mpExtra = "折叠";
  },
  methods: {
    // 更新线上版本的 store 记录
    resolvestableVersionStoreList() {
      const modifiedMap = {};
      const modifiedKeys = [];
      this.formData.store_list.forEach((item, index) => {
        modifiedKeys.push(item.id);
        modifiedMap[item.id] = index;
      });
      return this.fetchAppInfo(this.getFormData("appid"), "Android").then((res) => {
        if (!res.success)
          return;
        if (res.store_list) {
          const originalMap = {};
          const originalKeys = [];
          res.store_list.forEach((item, index) => {
            originalKeys.push(item.id);
            originalMap[item.id] = index;
          });
          modifiedKeys.forEach((key, index) => {
            const afterItem = this.formData.store_list[modifiedMap[key]];
            if (originalKeys.indexOf(key) === -1) {
              res.store_list.push(afterItem);
            } else {
              res.store_list[originalMap[key]].name = afterItem.name;
              res.store_list[originalMap[key]].scheme = afterItem.scheme;
            }
          });
          for (let i = 0; i < res.store_list.length; i++) {
            let id = res.store_list[i].id;
            if (this.deletedStore.indexOf(id) !== -1 && modifiedKeys.indexOf(id) === -1) {
              res.store_list.splice(i, 1);
              i--;
            }
          }
        } else {
          res.store_list = this.formData.store_list;
        }
        return this.updateAppVersion(res._id, {
          store_list: res.store_list
        });
      });
    },
    updateAppVersion(id, value) {
      return db.collection("opendb-app-versions").doc(id).update(value);
    },
    /**
     * 验证表单并提交
     */
    submit() {
      common_vendor.index.showLoading({
        mask: true
      });
      this.formatFormData();
      this.$refs.form.validate(this.keepItems).then((res) => {
        return this.submitForm(res);
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/system/app/add.vue:338", err);
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    /**
     * 提交表单
     */
    submitForm(value) {
      (this.isEdit ? this.requestCloudFunction("setNewAppData", {
        id: this.formDataId,
        value
      }) : db.collection(dbCollectionName).add(value)).then((res) => {
        if (this.isEdit)
          return this.resolvestableVersionStoreList();
      }).then(() => {
        common_vendor.index.showToast({
          title: `${this.isEdit ? "更新" : "新增"}成功`
        });
        this.getOpenerEventChannel().emit("refreshData");
        setTimeout(() => common_vendor.index.navigateBack(), 500);
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "请求服务失败",
          showCancel: false
        });
      });
    },
    /**
     * 获取表单数据
     * @param {Object} id
     */
    getDetail(id) {
      common_vendor.index.showLoading({
        mask: true
      });
      db.collection(dbCollectionName).where({
        appid: id
      }).get().then((res) => {
        const data = res.result.data[0];
        if (data) {
          this.formDataId = data._id;
          this.initFormData(data);
        } else {
          this.autoFill();
          this.autoFillApp();
        }
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "请求服务失败",
          showCancel: false
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    // 切换手风琴状态
    mpAccordion() {
      if (this.mpAccordionStatus) {
        this.mpExtra = "展开";
        this.mpAccordionStatus = 0;
      } else {
        this.mpExtra = "折叠";
        this.mpAccordionStatus = 1;
      }
    },
    addStoreScheme() {
      this.formData.store_list.push({
        enable: false,
        priority: 0,
        id: randomString(5) + "_" + Date.now()
      });
    },
    deleteStore(index, item) {
      if (item.scheme && item.scheme.trim().length && this.isEdit) {
        common_vendor.index.showModal({
          content: "是否同步删除线上版本此条商店记录？",
          success: (res) => {
            const storeItem = this.formData.store_list.splice(index, 1)[0];
            if (storeItem && res.confirm) {
              this.deletedStore.push(storeItem.id);
            }
          }
        });
      } else {
        this.formData.store_list.splice(index, 1)[0];
      }
    },
    schemeDemo() {
      $refs.scheme.open("center");
    }
  }
};
if (!Array) {
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_uni_file_picker2 = common_vendor.resolveComponent("uni-file-picker");
  const _easycom_show_info2 = common_vendor.resolveComponent("show-info");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_notice_bar2 + _easycom_uni_data_select2 + _easycom_uni_forms_item2 + _easycom_uni_easyinput2 + _easycom_uni_card2 + _easycom_uni_file_picker2 + _easycom_show_info2 + _easycom_uni_popup2 + _easycom_uni_forms2)();
}
const _easycom_uni_notice_bar = () => "../../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
const _easycom_uni_data_select = () => "../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_card = () => "../../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_uni_file_picker = () => "../../../uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker.js";
const _easycom_show_info = () => "../../../components/show-info/show-info.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_notice_bar + _easycom_uni_data_select + _easycom_uni_forms_item + _easycom_uni_easyinput + _easycom_uni_card + _easycom_uni_file_picker + _easycom_show_info + _easycom_uni_popup + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      showIcon: true,
      text: "本页面信息，在应用发布、app升级模块中，都会关联使用，请认真填写"
    }),
    b: common_vendor.o(($event) => _ctx.formData.app_type = $event),
    c: common_vendor.p({
      localdata: $data.appTypeOptions,
      placeholder: "请选择应用类型",
      clear: false,
      modelValue: _ctx.formData.app_type
    }),
    d: common_vendor.p({
      name: "app_type",
      label: "应用类型",
      required: true
    }),
    e: common_vendor.o(($event) => _ctx.formData.appid = $event),
    f: common_vendor.p({
      disabled: _ctx.isEdit,
      placeholder: "应用的AppID",
      trim: "both",
      modelValue: _ctx.formData.appid
    }),
    g: common_vendor.p({
      name: "appid",
      label: "AppID",
      required: true
    }),
    h: common_vendor.o(($event) => _ctx.formData.name = $event),
    i: common_vendor.p({
      disabled: _ctx.isEdit,
      placeholder: "应用名称",
      trim: "both",
      modelValue: _ctx.formData.name
    }),
    j: common_vendor.p({
      name: "name",
      label: "应用名称",
      required: true
    }),
    k: common_vendor.o(($event) => _ctx.formData.introduction = $event),
    l: common_vendor.p({
      placeholder: "应用简介",
      trim: "both",
      modelValue: _ctx.formData.introduction
    }),
    m: common_vendor.p({
      name: "introduction",
      label: "应用简介"
    }),
    n: -1,
    o: common_vendor.o([($event) => _ctx.formData.description = $event.detail.value, ($event) => _ctx.binddata("description", $event.detail.value)]),
    p: _ctx.formData.description,
    q: common_vendor.p({
      name: "description",
      label: "应用描述"
    }),
    r: -1,
    s: common_vendor.o([($event) => _ctx.formData.remark = $event.detail.value, ($event) => _ctx.binddata("remark", $event.detail.value)]),
    t: _ctx.formData.remark,
    v: common_vendor.p({
      name: "remark",
      label: "应用备注"
    }),
    w: common_vendor.p({
      title: "基础信息"
    }),
    x: common_vendor.o((res) => _ctx.iconUrlSuccess(res, "icon_url")),
    y: common_vendor.o((res) => _ctx.iconUrlDelete(res, "icon_url")),
    z: common_vendor.o(($event) => _ctx.middleware_img.icon_url = $event),
    A: common_vendor.p({
      ["image-styles"]: {
        "width": "200rpx"
      },
      ["return-type"]: "object",
      ["file-mediatype"]: "image",
      limit: "1",
      mode: "grid",
      modelValue: _ctx.middleware_img.icon_url
    }),
    B: common_vendor.p({
      label: "应用图标"
    }),
    C: common_vendor.o(_ctx.iconUrlDelete),
    D: common_vendor.o(($event) => _ctx.screenshotList = $event),
    E: common_vendor.p({
      ["file-mediatype"]: "image",
      mode: "grid",
      ["image-styles"]: {
        "height": "500rpx",
        "width": "300rpx"
      },
      modelValue: _ctx.screenshotList
    }),
    F: common_vendor.p({
      label: "应用截图"
    }),
    G: common_vendor.p({
      title: "图标素材"
    }),
    H: _ctx.isEdit
  }, _ctx.isEdit ? {
    I: common_vendor.o((...args) => _ctx.autoFillApp && _ctx.autoFillApp(...args)),
    J: common_vendor.p({
      left: -10,
      top: -35,
      width: "230",
      content: "从App升级中心同步应用安装包信息"
    })
  } : {}, {
    K: common_vendor.f(_ctx.appPlatformKeys, (item, k0, i0) => {
      return common_vendor.e({
        a: item,
        b: _ctx.middleware_checkbox[item],
        c: common_vendor.t(_ctx.appPlatformValues[item]),
        d: _ctx.getPlatformChcekbox(item) ? 1 : "",
        e: common_vendor.o(({
          detail: {
            value
          }
        }) => {
          _ctx.setPlatformChcekbox(item, !!value.length);
        }, item),
        f: _ctx.getPlatformChcekbox(item)
      }, _ctx.getPlatformChcekbox(item) ? common_vendor.e({
        g: "24898c9d-21-" + i0 + "," + ("24898c9d-20-" + i0),
        h: common_vendor.o(($event) => _ctx.formData[item].name = $event, item),
        i: common_vendor.p({
          trim: "both",
          modelValue: _ctx.formData[item].name
        }),
        j: "24898c9d-20-" + i0 + ",24898c9d-18",
        k: common_vendor.p({
          label: "名称"
        }),
        l: item === "app_android"
      }, item === "app_android" ? common_vendor.e({
        m: common_vendor.o((e) => this.uniFilePickerProvider = e.detail.value, item),
        n: common_vendor.o((...args) => _ctx.selectFile && _ctx.selectFile(...args), item),
        o: common_vendor.o((res) => _ctx.iconUrlSuccess(res, `${item}.url`), item),
        p: common_vendor.o((res) => _ctx.iconUrlDelete(res, `${item}.url`), item),
        q: "24898c9d-23-" + i0 + "," + ("24898c9d-22-" + i0),
        r: common_vendor.o(($event) => _ctx.appPackageInfo = $event, item),
        s: common_vendor.p({
          ["file-extname"]: "apk",
          disabled: _ctx.hasPackage,
          provider: $data.uniFilePickerProvider,
          returnType: "object",
          ["file-mediatype"]: "all",
          limit: "1",
          modelValue: _ctx.appPackageInfo
        }),
        t: _ctx.hasPackage
      }, _ctx.hasPackage ? {
        v: common_vendor.t(_ctx.appPackageInfo.size && Number(_ctx.appPackageInfo.size / 1024 / 1024).toFixed(2) + "M")
      } : {}, {
        w: "24898c9d-22-" + i0 + ",24898c9d-18",
        x: common_vendor.p({
          label: "上传apk包"
        })
      }) : {}, {
        y: "24898c9d-25-" + i0 + "," + ("24898c9d-24-" + i0),
        z: common_vendor.o(($event) => _ctx.formData[item].url = $event, item),
        A: common_vendor.p({
          maxlength: -1,
          trim: "both",
          modelValue: _ctx.formData[item].url
        }),
        B: "24898c9d-24-" + i0 + ",24898c9d-18",
        C: common_vendor.p({
          label: item === "app_ios" ? "AppStore 链接" : "下载链接"
        }),
        D: item === "app_ios"
      }, item === "app_ios" ? {
        E: "24898c9d-27-" + i0 + "," + ("24898c9d-26-" + i0),
        F: common_vendor.o(($event) => _ctx.formData[item].abm_url = $event, item),
        G: common_vendor.p({
          maxlength: -1,
          trim: "both",
          modelValue: _ctx.formData[item].abm_url
        }),
        H: "24898c9d-26-" + i0 + ",24898c9d-18",
        I: common_vendor.p({
          label: "获取 ABM 应用登录链接"
        })
      } : {}) : {}, {
        J: item
      });
    }),
    L: common_vendor.sr("scheme", "24898c9d-28,24898c9d-18"),
    M: common_vendor.p({
      ["background-color"]: "#fff"
    }),
    N: common_vendor.o((...args) => $options.schemeDemo && $options.schemeDemo(...args)),
    O: common_vendor.o((...args) => $options.addStoreScheme && $options.addStoreScheme(...args)),
    P: common_vendor.f(_ctx.formData.store_list, (item, index, i0) => {
      return {
        a: common_vendor.o(($event) => $options.deleteStore(index, item), item.id),
        b: "24898c9d-32-" + i0 + "," + ("24898c9d-31-" + i0),
        c: common_vendor.o(($event) => item.name = $event, item.id),
        d: common_vendor.p({
          trim: "both",
          modelValue: item.name
        }),
        e: "24898c9d-31-" + i0 + "," + ("24898c9d-30-" + i0),
        f: "24898c9d-34-" + i0 + "," + ("24898c9d-33-" + i0),
        g: common_vendor.o(($event) => item.scheme = $event, item.id),
        h: common_vendor.p({
          maxlength: -1,
          trim: "both",
          modelValue: item.scheme
        }),
        i: "24898c9d-33-" + i0 + "," + ("24898c9d-30-" + i0),
        j: "24898c9d-30-" + i0 + ",24898c9d-29",
        k: item.id
      };
    }),
    Q: common_vendor.p({
      label: "商店名称"
    }),
    R: common_vendor.p({
      label: "Scheme"
    }),
    S: common_vendor.p({
      title: ""
    }),
    T: common_vendor.p({
      name: "store_schemes",
      label: "Android应用市场",
      labelWidth: "120"
    }),
    U: common_vendor.p({
      title: "App 信息"
    }),
    V: common_vendor.f(_ctx.mpPlatformKeys, (item, k0, i0) => {
      return common_vendor.e({
        a: item,
        b: _ctx.middleware_checkbox[item],
        c: common_vendor.t(_ctx.mpPlatform[item]),
        d: _ctx.getPlatformChcekbox(item) ? 1 : "",
        e: common_vendor.o(({
          detail: {
            value
          }
        }) => {
          _ctx.setPlatformChcekbox(item, !!value.length);
        }, item),
        f: $data.mpAccordionStatus && _ctx.getPlatformChcekbox(item)
      }, $data.mpAccordionStatus && _ctx.getPlatformChcekbox(item) ? {
        g: "24898c9d-37-" + i0 + "," + ("24898c9d-36-" + i0),
        h: common_vendor.o(($event) => _ctx.formData[item].name = $event, item),
        i: common_vendor.p({
          trim: "both",
          modelValue: _ctx.formData[item].name
        }),
        j: "24898c9d-36-" + i0 + ",24898c9d-35",
        k: common_vendor.p({
          label: "名称"
        }),
        l: common_vendor.o((res) => _ctx.iconUrlSuccess(res, `${item}.qrcode_url`), item),
        m: common_vendor.o((res) => _ctx.iconUrlDelete(res, `${item}.qrcode_url`), item),
        n: "24898c9d-39-" + i0 + "," + ("24898c9d-38-" + i0),
        o: common_vendor.o(($event) => _ctx.middleware_img[item] = $event, item),
        p: common_vendor.p({
          ["image-styles"]: {
            "width": "200rpx"
          },
          ["return-type"]: "object",
          ["file-mediatype"]: "image",
          limit: "1",
          mode: "grid",
          modelValue: _ctx.middleware_img[item]
        }),
        q: "24898c9d-38-" + i0 + ",24898c9d-35",
        r: common_vendor.p({
          label: _ctx.mpPlatform[item].slice(-3) + "码"
        })
      } : {}, {
        s: item
      });
    }),
    W: common_vendor.p({
      title: "小程序/快应用信息"
    }),
    X: common_vendor.o(($event) => _ctx.formData.h5.url = $event),
    Y: common_vendor.p({
      maxlength: -1,
      trim: "both",
      modelValue: _ctx.formData.h5.url
    }),
    Z: common_vendor.p({
      label: "链接地址"
    }),
    aa: common_vendor.p({
      title: "web信息"
    }),
    ab: _ctx.isEdit
  }, _ctx.isEdit ? {
    ac: common_vendor.p({
      isShadow: false
    })
  } : {}, {
    ad: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    ae: common_vendor.sr("form", "24898c9d-1"),
    af: common_vendor.o(($event) => _ctx.formData = $event),
    ag: common_vendor.p({
      validateTrigger: "bind",
      labelWidth: $data.labelWidth,
      rules: _ctx.rules,
      modelValue: _ctx.formData
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/system/app/add.js.map
