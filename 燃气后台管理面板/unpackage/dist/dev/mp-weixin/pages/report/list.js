"use strict";
const common_vendor = require("../../common/vendor.js");
const db = common_vendor.tr.database();
db.command;
const dbCollectionName = "report";
const _sfc_main = {
  data() {
    return {
      loading: false,
      where: "",
      tableData: [],
      selectedIndexs: [],
      options: {
        pageCurrent: 1,
        pageSize: 20,
        total: 0
      },
      imageStyles: {
        width: 64,
        height: 64
      }
    };
  },
  onLoad() {
    this.getCloudDataList();
  },
  onReachBottom() {
    this.loadMore();
  },
  methods: {
    async getCloudDataList() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        const res = await db.collection(dbCollectionName).orderBy("updateTime", "desc").skip((this.options.pageCurrent - 1) * this.options.pageSize).limit(this.options.pageSize).get();
        this.tableData = res.data.data || [];
        this.options.total = res.data.affectedDocs || 0;
      } catch (err) {
        common_vendor.index.$u.toast("获取数据失败");
        common_vendor.index.__f__("error", "at pages/report/list.vue:92", err);
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      if (this.options.pageCurrent * this.options.pageSize < this.options.total) {
        this.options.pageCurrent++;
        this.getCloudDataList();
      }
    },
    change(e) {
      this.options.pageCurrent = e.current;
      this.getCloudDataList();
    },
    selectionChange(e) {
      this.selectedIndexs = e.detail.index;
    },
    confirmDelete(id) {
      common_vendor.index.showModal({
        content: "是否删除该条记录？",
        success: async (res) => {
          if (res.confirm) {
            await this.deleteRecord(id);
          }
        }
      });
    },
    async deleteRecord(id) {
      try {
        const res = await db.collection(dbCollectionName).doc(id).remove();
        if (res.data.deleted > 0) {
          common_vendor.index.$u.toast("删除成功");
          this.getCloudDataList();
        }
      } catch (err) {
        common_vendor.index.$u.toast("删除失败");
        common_vendor.index.__f__("error", "at pages/report/list.vue:129", err);
      }
    },
    navigateTo(url) {
      common_vendor.index.navigateTo({
        url
      });
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
    }
  }
};
if (!Array) {
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  (_easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_tag2 + _easycom_uni_table2 + _easycom_uni_pagination2)();
}
const _easycom_uni_th = () => "../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_tag = () => "../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_uni_table = () => "../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
if (!Math) {
  (_easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_tag + _easycom_uni_table + _easycom_uni_pagination)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      width: "150",
      align: "center"
    }),
    b: common_vendor.p({
      width: "150",
      align: "center"
    }),
    c: common_vendor.p({
      width: "120",
      align: "center"
    }),
    d: common_vendor.p({
      width: "120",
      align: "center"
    }),
    e: common_vendor.p({
      width: "100",
      align: "center"
    }),
    f: common_vendor.p({
      width: "150",
      align: "center"
    }),
    g: common_vendor.p({
      width: "200",
      align: "center"
    }),
    h: common_vendor.f($data.tableData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.reading),
        b: "4ce5e43f-10-" + i0 + "," + ("4ce5e43f-9-" + i0),
        c: common_vendor.t(item.address),
        d: "4ce5e43f-11-" + i0 + "," + ("4ce5e43f-9-" + i0),
        e: common_vendor.t(item.building || "-"),
        f: "4ce5e43f-12-" + i0 + "," + ("4ce5e43f-9-" + i0),
        g: common_vendor.t(item.date),
        h: "4ce5e43f-13-" + i0 + "," + ("4ce5e43f-9-" + i0),
        i: "4ce5e43f-15-" + i0 + "," + ("4ce5e43f-14-" + i0),
        j: common_vendor.p({
          text: item.status,
          type: $options.getStatusType(item.status)
        }),
        k: "4ce5e43f-14-" + i0 + "," + ("4ce5e43f-9-" + i0),
        l: common_vendor.t($options.formatTime(item.updateTime)),
        m: "4ce5e43f-16-" + i0 + "," + ("4ce5e43f-9-" + i0),
        n: common_vendor.o(($event) => $options.navigateTo("./edit?id=" + item._id), index),
        o: common_vendor.o(($event) => $options.navigateTo("./detail?id=" + item._id), index),
        p: common_vendor.o(($event) => $options.confirmDelete(item._id), index),
        q: "4ce5e43f-17-" + i0 + "," + ("4ce5e43f-9-" + i0),
        r: index,
        s: "4ce5e43f-9-" + i0 + ",4ce5e43f-0"
      };
    }),
    i: common_vendor.sr("table", "4ce5e43f-0"),
    j: common_vendor.o($options.selectionChange),
    k: common_vendor.p({
      loading: $data.loading,
      border: true,
      stripe: true,
      emptyText: "暂无更多数据",
      type: "selection"
    }),
    l: common_vendor.o($options.change),
    m: common_vendor.p({
      ["show-icon"]: true,
      ["page-size"]: $data.options.pageSize,
      current: $data.options.pageCurrent,
      total: $data.options.total
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/report/list.js.map
