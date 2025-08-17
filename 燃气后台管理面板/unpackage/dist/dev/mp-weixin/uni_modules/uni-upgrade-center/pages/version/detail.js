"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniUpgradeCenter_pages_mixin_version_add_detail_mixin = require("../mixin/version_add_detail_mixin.js");
const uni_modules_uniUpgradeCenter_pages_utils = require("../utils.js");
const db = common_vendor.tr.database();
db.command;
const dbCollectionName = uni_modules_uniUpgradeCenter_pages_utils.appVersionListDbName;
const _sfc_main = {
  mixins: [uni_modules_uniUpgradeCenter_pages_mixin_version_add_detail_mixin.addAndDetail],
  data() {
    return {
      showStableInfo: false,
      isStable: true,
      // 是否是线上发行版
      originalData: {},
      // 原始数据，用于恢复状态
      detailsState: true,
      // 查看状态,
      uniFilePickerProvider: "unicloud",
      domain: ""
    };
  },
  async onLoad(e) {
    let { domain, provider } = this.getCloudStorageConfig();
    if (domain)
      this.domain = domain;
    if (provider)
      this.uniFilePickerProvider = provider;
    const id = e.id;
    this.formDataId = id;
    await this.getDetail(id);
    this.isStable = this.formData.stable_publish;
    this.latestStableData = await this.getLatestVersion();
    if (this.isWGT) {
      this.rules.min_uni_version.rules.push({
        "required": true
      });
    }
  },
  onUnload() {
    this.setCloudStorage({
      provider: null
    });
  },
  watch: {
    domain(val) {
      this.setCloudStorage({
        domain: val
      });
      if (this.formData.url) {
        if (!val)
          val = "请输入自定义域名";
        this.formData.url = this.formData.url.replace(/^(https?:\/\/)[^\/]+/, `$1${val}`);
      }
    },
    uniFilePickerProvider(val) {
      this.setCloudStorage({
        provider: val
      });
    }
  },
  methods: {
    /**
     * 触发表单提交
     */
    submit() {
      common_vendor.index.showLoading({
        mask: true
      });
      this.$refs.form.validate(["store_list"]).then((res) => {
        if (res.store_list) {
          res.store_list.forEach((item) => {
            item.priority = parseFloat(item.priority);
          });
        }
        this.submitForm(res);
      }).catch((errors) => {
        common_vendor.index.hideLoading();
      });
    },
    async submitForm(value) {
      const collectionDB = db.collection(dbCollectionName);
      collectionDB.doc(this.formDataId).update(value).then(async (res) => {
        if (!this.isStable && value.stable_publish === true && this.latestStableData) {
          await collectionDB.doc(this.latestStableData._id).update({
            stable_publish: false
          });
        }
        common_vendor.index.showToast({
          title: "修改成功"
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
    },
    /**
     * 获取表单数据
     * @param {Object} id
     */
    getDetail(id) {
      common_vendor.index.showLoading({
        mask: true
      });
      return db.collection(dbCollectionName).doc(id).field(uni_modules_uniUpgradeCenter_pages_mixin_version_add_detail_mixin.fields).get().then((res) => {
        const data = res.result.data[0];
        if (data) {
          if (!data.store_list)
            data.store_list = [];
          this.formData = data;
          this.originalData = uni_modules_uniUpgradeCenter_pages_utils.deepClone(this.formData);
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
    deletePackage() {
      common_vendor.index.showModal({
        title: "提示",
        content: "是否删除该版本",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              mask: true
            });
            db.collection(dbCollectionName).doc(this.formDataId).remove().then(() => {
              common_vendor.index.showToast({
                title: "删除成功"
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
      });
    },
    async getLatestVersion() {
      const where = {
        appid: this.formData.appid,
        type: this.formData.type,
        stable_publish: true
      };
      if (!this.isWGT) {
        where.platform = this.formData.platform[0];
      }
      const latestStableData = await db.collection(dbCollectionName).where(where).get();
      return latestStableData.result.data.find((item) => item.platform.toString() === this.formData.platform.toString());
    },
    cancelEdit() {
      let content = "";
      !this.isiOS && this.hasPackage ? content += "\n将会删除已上传的包" : "";
      common_vendor.index.showModal({
        title: "取消修改",
        content,
        success: (res) => {
          if (res.confirm) {
            this.formData = uni_modules_uniUpgradeCenter_pages_utils.deepClone(this.originalData);
            this.detailsState = true;
            if (this.hasPackage) {
              this.deleteFile([this.appFileList.url]);
            }
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_show_info2 = common_vendor.resolveComponent("show-info");
  const _easycom_uni_file_picker2 = common_vendor.resolveComponent("uni-file-picker");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_checkbox2 + _easycom_show_info2 + _easycom_uni_file_picker2 + _easycom_uni_card2 + _easycom_uni_dateformat2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../../uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_checkbox = () => "../../../uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_show_info = () => "../../../../components/show-info/show-info.js";
const _easycom_uni_file_picker = () => "../../../uni-file-picker/components/uni-file-picker/uni-file-picker.js";
const _easycom_uni_card = () => "../../../uni-card/components/uni-card/uni-card.js";
const _easycom_uni_dateformat = () => "../../../uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_forms = () => "../../../uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_checkbox + _easycom_show_info + _easycom_uni_file_picker + _easycom_uni_card + _easycom_uni_dateformat + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(_ctx.type_valuetotext[_ctx.formData.type]),
    b: !$data.isStable
  }, !$data.isStable ? {
    c: common_vendor.o((...args) => $options.deletePackage && $options.deletePackage(...args))
  } : {}, {
    d: common_vendor.o(($event) => _ctx.formData.appid = $event),
    e: common_vendor.p({
      disabled: true,
      trim: "both",
      modelValue: _ctx.formData.appid
    }),
    f: common_vendor.p({
      name: "appid",
      label: "AppID",
      required: true
    }),
    g: common_vendor.o(($event) => _ctx.formData.name = $event),
    h: common_vendor.p({
      disabled: true,
      trim: "both",
      modelValue: _ctx.formData.name
    }),
    i: common_vendor.p({
      name: "name",
      label: "应用名称"
    }),
    j: common_vendor.o(($event) => _ctx.formData.title = $event),
    k: common_vendor.p({
      disabled: $data.detailsState,
      placeholder: "更新标题",
      modelValue: _ctx.formData.title
    }),
    l: common_vendor.p({
      name: "title",
      label: "更新标题"
    }),
    m: $data.detailsState,
    n: common_vendor.o(($event) => _ctx.binddata("contents", $event.detail.value)),
    o: _ctx.formData.contents,
    p: common_vendor.o((val) => _ctx.formData.contents = val),
    q: common_vendor.p({
      name: "contents",
      label: "更新内容",
      required: true
    }),
    r: common_vendor.o(($event) => _ctx.formData.platform = $event),
    s: common_vendor.p({
      disabled: true,
      multiple: _ctx.isWGT,
      localdata: _ctx.platformLocaldata,
      modelValue: _ctx.formData.platform
    }),
    t: common_vendor.p({
      name: "platform",
      label: "平台",
      required: true
    }),
    v: common_vendor.o(($event) => _ctx.formData.version = $event),
    w: common_vendor.p({
      disabled: true,
      placeholder: "当前包版本号，必须大于当前已上线版本号",
      modelValue: _ctx.formData.version
    }),
    x: common_vendor.p({
      name: "version",
      label: "版本号",
      required: true
    }),
    y: _ctx.isWGT
  }, _ctx.isWGT ? {
    z: common_vendor.o(($event) => _ctx.formData.min_uni_version = $event),
    A: common_vendor.p({
      disabled: $data.detailsState,
      placeholder: "原生App最低版本",
      modelValue: _ctx.formData.min_uni_version
    }),
    B: common_vendor.p({
      content: _ctx.minUniVersionContent
    }),
    C: common_vendor.p({
      name: "min_uni_version",
      label: "原生App最低版本",
      required: _ctx.isWGT
    })
  } : {}, {
    D: _ctx.enableUploadPackage && !$data.detailsState
  }, _ctx.enableUploadPackage && !$data.detailsState ? common_vendor.e({
    E: $data.uniFilePickerProvider === "unicloud",
    F: $data.uniFilePickerProvider === "extStorage",
    G: common_vendor.o((e) => $data.uniFilePickerProvider = e.detail.value),
    H: common_vendor.o(($event) => _ctx.toUrl("https://doc.dcloud.net.cn/uniCloud/ext-storage/service.html")),
    I: common_vendor.p({
      label: "存储选择"
    }),
    J: $data.uniFilePickerProvider === "extStorage"
  }, $data.uniFilePickerProvider === "extStorage" ? {
    K: common_vendor.o(($event) => $data.domain = $event),
    L: common_vendor.p({
      placeholder: "请输入扩展存储自定义域名",
      maxlength: -1,
      modelValue: $data.domain
    }),
    M: common_vendor.p({
      label: "自定义域名"
    })
  } : {}, {
    N: common_vendor.o((...args) => _ctx.selectFile && _ctx.selectFile(...args)),
    O: common_vendor.o(_ctx.packageUploadSuccess),
    P: common_vendor.o(_ctx.packageDelete),
    Q: common_vendor.o(($event) => _ctx.appFileList = $event),
    R: common_vendor.p({
      ["file-extname"]: _ctx.fileExtname,
      disabled: _ctx.hasPackage,
      returnType: "object",
      ["file-mediatype"]: "all",
      limit: "1",
      provider: $data.uniFilePickerProvider,
      modelValue: _ctx.appFileList
    }),
    S: _ctx.hasPackage
  }, _ctx.hasPackage ? {
    T: common_vendor.t(Number(_ctx.appFileList.size / 1024 / 1024).toFixed(2))
  } : {}, {
    U: common_vendor.p({
      label: "上传" + _ctx.fileExtname[0] + "包"
    })
  }) : {}, {
    V: common_vendor.o(($event) => _ctx.formData.url = $event),
    W: common_vendor.p({
      disabled: $data.detailsState,
      placeholder: "下载链接",
      maxlength: -1,
      modelValue: _ctx.formData.url
    }),
    X: _ctx.formData.url
  }, _ctx.formData.url ? {
    Y: common_vendor.o(($event) => _ctx.toUrl(_ctx.formData.url))
  } : {}, {
    Z: _ctx.formData.url && !$data.detailsState
  }, _ctx.formData.url && !$data.detailsState ? {} : {}, {
    aa: common_vendor.p({
      name: "url",
      label: _ctx.urlLabel,
      required: true
    }),
    ab: _ctx.isAndroid && !_ctx.isWGT && _ctx.formData.store_list.length
  }, _ctx.isAndroid && !_ctx.isWGT && _ctx.formData.store_list.length ? {
    ac: common_vendor.f(_ctx.formData.store_list, (item, index, i0) => {
      return {
        a: item.enable,
        b: common_vendor.o(({
          detail: {
            value
          }
        }) => {
          item.enable = !!value.length;
        }, item.id),
        c: "4fbff74e-25-" + i0 + "," + ("4fbff74e-24-" + i0),
        d: common_vendor.o(($event) => item.name = $event, item.id),
        e: common_vendor.p({
          disabled: true,
          trim: "both",
          modelValue: item.name
        }),
        f: "4fbff74e-24-" + i0 + "," + ("4fbff74e-23-" + i0),
        g: "4fbff74e-27-" + i0 + "," + ("4fbff74e-26-" + i0),
        h: common_vendor.o(($event) => item.scheme = $event, item.id),
        i: common_vendor.p({
          disabled: true,
          trim: "both",
          modelValue: item.scheme
        }),
        j: "4fbff74e-26-" + i0 + "," + ("4fbff74e-23-" + i0),
        k: "4fbff74e-29-" + i0 + "," + ("4fbff74e-28-" + i0),
        l: common_vendor.o(($event) => item.priority = $event, item.id),
        m: common_vendor.p({
          disabled: $data.detailsState,
          type: "number",
          modelValue: item.priority
        }),
        n: "4fbff74e-30-" + i0 + "," + ("4fbff74e-28-" + i0),
        o: "4fbff74e-28-" + i0 + "," + ("4fbff74e-23-" + i0),
        p: "4fbff74e-23-" + i0 + ",4fbff74e-22",
        q: item.id
      };
    }),
    ad: $data.detailsState,
    ae: common_vendor.p({
      label: "商店名称"
    }),
    af: common_vendor.p({
      label: "Scheme"
    }),
    ag: common_vendor.p({
      top: -100,
      left: -180,
      content: _ctx.priorityContent
    }),
    ah: common_vendor.p({
      label: "优先级"
    }),
    ai: common_vendor.p({
      label: "Android应用市场",
      name: "store_list",
      labelWidth: "120"
    })
  } : {}, {
    aj: _ctx.isWGT
  }, _ctx.isWGT ? {
    ak: $data.detailsState,
    al: common_vendor.o(($event) => (_ctx.binddata("is_silently", $event.detail.value), _ctx.formData.is_silently = $event.detail.value)),
    am: _ctx.formData.is_silently,
    an: common_vendor.p({
      top: -80,
      content: _ctx.silentlyContent
    }),
    ao: common_vendor.p({
      name: "is_silently",
      label: "静默更新"
    })
  } : {}, {
    ap: $data.detailsState,
    aq: common_vendor.o(($event) => (_ctx.binddata("is_mandatory", $event.detail.value), _ctx.formData.is_mandatory = $event.detail.value)),
    ar: _ctx.formData.is_mandatory,
    as: common_vendor.p({
      width: "230",
      top: -30,
      content: _ctx.mandatoryContent
    }),
    at: common_vendor.p({
      name: "is_mandatory",
      label: "强制更新"
    }),
    av: $data.detailsState || $data.isStable,
    aw: common_vendor.o(($event) => (_ctx.binddata("stable_publish", $event.detail.value), _ctx.formData.stable_publish = $event.detail.value)),
    ax: _ctx.formData.stable_publish,
    ay: $data.isStable
  }, $data.isStable ? {
    az: common_vendor.p({
      top: -50,
      width: "350",
      content: _ctx.stablePublishContent
    })
  } : {
    aA: common_vendor.p({
      top: -40,
      content: _ctx.stablePublishContent2
    })
  }, {
    aB: common_vendor.p({
      name: "stable_publish",
      label: "上线发行"
    }),
    aC: common_vendor.p({
      format: "yyyy-MM-dd hh:mm:ss",
      date: _ctx.formData.create_date,
      threshold: [0, 0]
    }),
    aD: common_vendor.p({
      name: "create_date",
      label: "上传时间"
    }),
    aE: common_vendor.o(($event) => _ctx.formData.type = $event),
    aF: common_vendor.p({
      localdata: _ctx.formOptions.type_localdata,
      modelValue: _ctx.formData.type
    }),
    aG: common_vendor.p({
      name: "type",
      label: "安装包类型"
    }),
    aH: $data.detailsState
  }, $data.detailsState ? {
    aI: common_vendor.o(($event) => $data.detailsState = false)
  } : {}, {
    aJ: !$data.detailsState
  }, !$data.detailsState ? {
    aK: common_vendor.o((...args) => $options.submit && $options.submit(...args))
  } : {}, {
    aL: !$data.detailsState
  }, !$data.detailsState ? {
    aM: common_vendor.o((...args) => $options.cancelEdit && $options.cancelEdit(...args))
  } : {}, {
    aN: common_vendor.sr("form", "4fbff74e-0"),
    aO: common_vendor.p({
      value: _ctx.formData,
      validateTrigger: "bind",
      labelWidth: _ctx.labelWidth
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uni-upgrade-center/pages/version/detail.js.map
