"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      reportData: {
        id: "",
        reading: "",
        lastReading: "",
        address: "",
        date: "",
        remark: "",
        status: "",
        imageUrl: ""
      },
      editableRemark: "",
      isEditing: false,
      originalRemark: ""
    };
  },
  computed: {
    gasUsage() {
      if (this.reportData.reading && this.reportData.lastReading) {
        const current = parseFloat(this.reportData.reading);
        const last = parseFloat(this.reportData.lastReading);
        return (current - last).toFixed(2);
      }
      return "0.00";
    }
  },
  onLoad(options) {
    this.reportData = {
      id: options.reportId || options.id || Date.now().toString().slice(-6),
      reading: options.reading || "",
      lastReading: options.lastReading || "",
      address: decodeURIComponent(options.address || ""),
      date: options.date || "",
      time: decodeURIComponent(options.time || ""),
      remark: decodeURIComponent(options.remarks || ""),
      status: options.status || "已识别",
      imageUrl: decodeURIComponent(options.imageUrl || ""),
      integerPart: options.integerPart || "",
      decimalPart: options.decimalPart || ""
    };
    this.editableRemark = this.reportData.remark;
    this.originalRemark = this.reportData.remark;
  },
  methods: {
    getStatusBgClass(status) {
      switch (status) {
        case "已确认":
          return "status-confirmed-bg";
        case "待审核":
          return "status-pending-bg";
        case "异常":
          return "status-abnormal-bg";
        default:
          return "status-default-bg";
      }
    },
    getStatusClass(status) {
      switch (status) {
        case "已确认":
          return "status-confirmed";
        case "待审核":
          return "status-pending";
        case "异常":
          return "status-abnormal";
        default:
          return "status-default";
      }
    },
    getStatusIcon(status) {
      switch (status) {
        case "已确认":
          return "✅";
        case "待审核":
          return "⏳";
        case "异常":
          return "⚠️";
        default:
          return "📋";
      }
    },
    getUsageTrend() {
      const usage = parseFloat(this.gasUsage);
      if (usage > 80)
        return "trend-high";
      if (usage > 40)
        return "trend-normal";
      return "trend-low";
    },
    getTrendIcon() {
      const usage = parseFloat(this.gasUsage);
      if (usage > 80)
        return "📈";
      if (usage > 40)
        return "➡️";
      return "📉";
    },
    getTrendText() {
      const usage = parseFloat(this.gasUsage);
      if (usage > 80)
        return "用量较高";
      if (usage > 40)
        return "正常用量";
      return "用量较低";
    },
    getCurrentTime() {
      return (/* @__PURE__ */ new Date()).toLocaleTimeString("zh-CN", { hour12: false });
    },
    previewImage() {
      if (this.reportData.imageUrl) {
        common_vendor.index.previewImage({
          urls: [this.reportData.imageUrl],
          current: this.reportData.imageUrl
        });
      }
    },
    toggleEdit() {
      if (this.isEditing) {
        this.saveRemark();
      } else {
        this.isEditing = true;
      }
    },
    async saveRemark() {
      try {
        const gasMeter = common_vendor.tr.importObject("gasMeter");
        const result = await gasMeter.updateReport(this.reportData.id, {
          remark: this.editableRemark
        });
        if (result.errCode === 0) {
          this.reportData.remark = this.editableRemark;
          this.originalRemark = this.editableRemark;
          this.isEditing = false;
          common_vendor.index.showToast({
            title: "备注已保存",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: "保存失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/reportDetail/reportDetail.vue:296", "保存备注失败:", error);
        common_vendor.index.showToast({
          title: "保存失败",
          icon: "none"
        });
      }
    },
    async confirmReport() {
      common_vendor.index.showModal({
        title: "确认报告",
        content: "确定要提交此抄表报告吗？",
        confirmText: "确定提交",
        cancelText: "继续编辑",
        confirmColor: "#4CAF50",
        success: async (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "提交中..." });
            try {
              const gasMeter = common_vendor.tr.importObject("gasMeter");
              const result = await gasMeter.updateReport(this.reportData.id, {
                status: "已确认"
              });
              common_vendor.index.hideLoading();
              if (result.errCode === 0) {
                common_vendor.index.showToast({
                  title: "报告已确认",
                  icon: "success"
                });
                setTimeout(() => {
                  common_vendor.index.navigateBack();
                }, 1500);
              } else {
                common_vendor.index.showToast({
                  title: "提交失败",
                  icon: "none"
                });
              }
            } catch (error) {
              common_vendor.index.hideLoading();
              common_vendor.index.__f__("error", "at pages/reportDetail/reportDetail.vue:341", "确认报告失败:", error);
              common_vendor.index.showToast({
                title: "提交失败",
                icon: "none"
              });
            }
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($options.getStatusIcon($data.reportData.status)),
    b: common_vendor.t($data.reportData.status || "已识别"),
    c: common_vendor.n($options.getStatusClass($data.reportData.status)),
    d: common_vendor.t($data.reportData.id || "001"),
    e: common_vendor.n($options.getStatusBgClass($data.reportData.status)),
    f: $data.reportData.imageUrl
  }, $data.reportData.imageUrl ? {
    g: $data.reportData.imageUrl,
    h: common_vendor.o((...args) => $options.previewImage && $options.previewImage(...args))
  } : {}, {
    i: common_vendor.t($data.reportData.reading),
    j: $data.reportData.lastReading
  }, $data.reportData.lastReading ? {
    k: common_vendor.t($data.reportData.lastReading)
  } : {}, {
    l: $data.reportData.lastReading
  }, $data.reportData.lastReading ? {
    m: common_vendor.t($options.gasUsage),
    n: common_vendor.t($options.getTrendIcon()),
    o: common_vendor.t($options.getTrendText()),
    p: common_vendor.n($options.getUsageTrend())
  } : {}, {
    q: common_vendor.t($data.reportData.address),
    r: common_vendor.t($data.reportData.date),
    s: common_vendor.t($options.getCurrentTime()),
    t: common_vendor.t($data.isEditing ? "✅" : "✏️"),
    v: common_vendor.t($data.isEditing ? "保存" : "编辑"),
    w: common_vendor.o((...args) => $options.toggleEdit && $options.toggleEdit(...args)),
    x: $data.isEditing ? 1 : "",
    y: !$data.isEditing,
    z: $data.editableRemark,
    A: common_vendor.o(($event) => $data.editableRemark = $event.detail.value),
    B: common_vendor.t($data.editableRemark.length),
    C: common_vendor.o((...args) => $options.confirmReport && $options.confirmReport(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9685baf5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/reportDetail/reportDetail.js.map
