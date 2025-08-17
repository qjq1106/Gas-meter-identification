"use strict";
const common_vendor = require("../../common/vendor.js");
const db = common_vendor.tr.database();
const dbCollectionName = "report";
const _sfc_main = {
  data() {
    return {
      reportData: null,
      loading: true,
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
        this.loading = true;
        const res = await db.collection(dbCollectionName).doc(this.recordId).get();
        if (res.data.data && res.data.data.length > 0) {
          this.reportData = res.data.data[0];
        }
      } catch (err) {
        common_vendor.index.$u.toast("加载数据失败");
        common_vendor.index.__f__("error", "at pages/report/detail.vue:154", err);
      } finally {
        this.loading = false;
      }
    },
    getStatusType(status) {
      const statusMap = {
        "已识别": "primary",
        "已确认": "success",
        "待审核": "warning",
        "异常": "error"
      };
      return statusMap[status] || "default";
    },
    formatTime(timestamp) {
      if (!timestamp)
        return "-";
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    },
    previewImage() {
      if (this.reportData.imageUrl && this.reportData.imageUrl.trim()) {
        common_vendor.index.previewImage({
          urls: [this.reportData.imageUrl],
          current: 0
        });
      }
    },
    editRecord() {
      common_vendor.index.navigateTo({
        url: `./edit?id=${this.recordId}`
      });
    },
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  (_easycom_uni_load_more2 + _easycom_uni_card2 + _easycom_uni_tag2)();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_uni_tag = () => "../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
if (!Math) {
  (_easycom_uni_load_more + _easycom_uni_card + _easycom_uni_tag)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loading
  }, $data.loading ? {
    b: common_vendor.p({
      status: "loading"
    })
  } : $data.reportData ? common_vendor.e({
    d: common_vendor.t($data.reportData.reading),
    e: common_vendor.t($data.reportData.lastReading || "-"),
    f: common_vendor.t($data.reportData.integerPart || "-"),
    g: common_vendor.t($data.reportData.decimalPart || "-"),
    h: common_vendor.p({
      title: "基础信息",
      ["is-shadow"]: true
    }),
    i: common_vendor.t($data.reportData.address),
    j: common_vendor.t($data.reportData.building || "-"),
    k: common_vendor.p({
      title: "位置信息",
      ["is-shadow"]: true
    }),
    l: common_vendor.t($data.reportData.date),
    m: common_vendor.t($data.reportData.time || "-"),
    n: common_vendor.t($options.formatTime($data.reportData.createTime)),
    o: common_vendor.t($options.formatTime($data.reportData.updateTime)),
    p: common_vendor.p({
      title: "时间信息",
      ["is-shadow"]: true
    }),
    q: common_vendor.p({
      text: $data.reportData.status,
      type: $options.getStatusType($data.reportData.status)
    }),
    r: $data.reportData.remark
  }, $data.reportData.remark ? {
    s: common_vendor.t($data.reportData.remark)
  } : {}, {
    t: common_vendor.p({
      title: "状态信息",
      ["is-shadow"]: true
    }),
    v: $data.reportData.imageUrl && $data.reportData.imageUrl.trim()
  }, $data.reportData.imageUrl && $data.reportData.imageUrl.trim() ? {
    w: $data.reportData.imageUrl,
    x: common_vendor.o((...args) => $options.previewImage && $options.previewImage(...args))
  } : {}, {
    y: common_vendor.p({
      title: "燃气表图片",
      ["is-shadow"]: true
    }),
    z: $data.reportData.ocrResult
  }, $data.reportData.ocrResult ? {
    A: common_vendor.p({
      text: $data.reportData.ocrResult.success ? "成功" : "失败",
      type: $data.reportData.ocrResult.success ? "success" : "error"
    }),
    B: common_vendor.t($data.reportData.ocrResult.request_id || "-"),
    C: common_vendor.t($data.reportData.ocrResult.integer || "-"),
    D: common_vendor.t($data.reportData.ocrResult.decimal || "-"),
    E: common_vendor.p({
      title: "OCR识别结果",
      ["is-shadow"]: true
    })
  } : {}, {
    F: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    G: common_vendor.o((...args) => $options.editRecord && $options.editRecord(...args))
  }) : {}, {
    c: $data.reportData
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/report/detail.js.map
