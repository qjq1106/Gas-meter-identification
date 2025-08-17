"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      selectedCategory: "全部",
      categories: ["全部", "1号楼", "2号楼", "3号楼", "4号楼", "5号楼", "6号楼", "7号楼", "8号楼", "9号楼", "10号楼", "11号楼", "12号楼"],
      reports: [],
      loading: false
    };
  },
  onLoad() {
    this.loadReports();
  },
  onShow() {
    this.loadReports();
  },
  computed: {
    filteredReports() {
      if (this.selectedCategory === "全部") {
        return this.reports;
      }
      return this.reports.filter((report) => report.building === this.selectedCategory);
    },
    confirmedCount() {
      return this.filteredReports.filter((r) => r.status === "已确认").length;
    },
    pendingCount() {
      return this.filteredReports.filter((r) => r.status === "待审核").length;
    },
    abnormalCount() {
      return this.filteredReports.filter((r) => r.status === "异常").length;
    }
  },
  methods: {
    // 加载报告数据
    async loadReports() {
      if (this.loading)
        return;
      this.loading = true;
      try {
        const gasMeter = common_vendor.tr.importObject("gasMeter");
        const result = await gasMeter.getReports(this.selectedCategory);
        if (result.errCode === 0) {
          this.reports = result.data.map((item) => ({
            id: item._id,
            building: item.building || "未分配",
            address: item.address,
            reading: item.reading,
            lastReading: item.lastReading || "",
            date: item.date,
            status: item.status,
            remark: item.remark || "",
            integerPart: item.integerPart || "",
            decimalPart: item.decimalPart || "",
            imageUrl: item.imageUrl || "",
            time: item.time || "",
            updateTime: item.updateTime
          })).sort((a, b) => {
            const timeA = new Date(a.updateTime || `${a.date} ${a.time}`).getTime();
            const timeB = new Date(b.updateTime || `${b.date} ${b.time}`).getTime();
            return timeB - timeA;
          });
        } else {
          common_vendor.index.__f__("error", "at pages/report/report.vue:194", "加载报告失败:", result.errMsg);
          common_vendor.index.showToast({
            title: "加载数据失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/report/report.vue:201", "加载报告出错:", error);
        common_vendor.index.showToast({
          title: "网络错误",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    selectCategory(category) {
      this.selectedCategory = category;
      this.loadReports();
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
    getUsage(report) {
      if (report.reading && report.lastReading) {
        const usage = parseFloat(report.reading) - parseFloat(report.lastReading);
        return usage.toFixed(2);
      }
      return "0.00";
    },
    viewReportDetail(report) {
      common_vendor.index.navigateTo({
        url: `/pages/reportDetail/reportDetail?reportId=${report.id}&reading=${report.reading}&lastReading=${report.lastReading}&address=${encodeURIComponent(report.address)}&date=${report.date}&time=${encodeURIComponent(report.time)}&remarks=${encodeURIComponent(report.remark || "")}&status=${report.status}&imageUrl=${encodeURIComponent(report.imageUrl || "")}&integerPart=${report.integerPart}&decimalPart=${report.decimalPart}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($options.filteredReports.length),
    b: common_vendor.t($options.confirmedCount),
    c: common_vendor.t($options.pendingCount),
    d: common_vendor.t($options.abnormalCount),
    e: common_vendor.f($data.categories, (category, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(category),
        b: $data.selectedCategory === category
      }, $data.selectedCategory === category ? {} : {}, {
        c: index,
        d: $data.selectedCategory === category ? 1 : "",
        e: common_vendor.o(($event) => $options.selectCategory(category), index)
      });
    }),
    f: $options.filteredReports.length === 0
  }, $options.filteredReports.length === 0 ? {
    g: common_vendor.t($data.selectedCategory)
  } : {
    h: common_vendor.f($options.filteredReports, (report, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(report.building),
        b: common_vendor.t(report.address),
        c: common_vendor.t(report.status),
        d: common_vendor.n($options.getStatusClass(report.status)),
        e: common_vendor.t(report.reading),
        f: common_vendor.t($options.getUsage(report)),
        g: common_vendor.t(report.date),
        h: report.remark
      }, report.remark ? {
        i: common_vendor.t(report.remark)
      } : {}, {
        j: report.id,
        k: index * 0.1 + "s",
        l: common_vendor.o(($event) => $options.viewReportDetail(report), report.id)
      });
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-12a8021c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/report/report.js.map
