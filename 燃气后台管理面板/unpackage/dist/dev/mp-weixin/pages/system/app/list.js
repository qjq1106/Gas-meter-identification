"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_opendbAppList = require("../../../js_sdk/validator/opendb-app-list.js");
const db = common_vendor.tr.database();
const dbOrderBy = "create_date";
const dbSearchFields = [];
const pageSize = 20;
const pageCurrent = 1;
const orderByMapping = {
  "ascending": "asc",
  "descending": "desc"
};
const _sfc_main = {
  data() {
    return {
      query: "",
      where: "",
      orderby: dbOrderBy,
      orderByFieldName: "",
      selectedIndexs: [],
      options: {
        pageSize,
        pageCurrent,
        filterData: {},
        ...js_sdk_validator_opendbAppList.enumConverter
      },
      imageStyles: {
        width: 64,
        height: 64
      },
      exportExcel: {
        "filename": "opendb-app-list.xls",
        "type": "xls",
        "fields": {
          "AppID": "appid",
          "应用类型": "app_type",
          "应用名称": "name",
          "应用描述": "description",
          "创建时间": "create_date"
        }
      },
      exportExcelData: [],
      addAppidLoading: true,
      descriptionThWidth: 380,
      buttonThWidth: 400,
      appTypeData: [
        {
          text: "uni-app",
          value: 0
        },
        {
          text: "uni-app x",
          value: 1
        }
      ]
    };
  },
  onLoad() {
    this._filter = {};
  },
  onReady() {
    this.$refs.udb.loadData();
  },
  computed: {
    ...common_vendor.mapState("app", ["appName", "appid"])
  },
  methods: {
    pageSizeChange(pageSize2) {
      this.options.pageSize = pageSize2;
      this.options.pageCurrent = 1;
      this.$nextTick(() => {
        this.loadData();
      });
    },
    onqueryload(data) {
      if (!data.find((item) => item.appid === this.appid)) {
        this.addCurrentAppid({
          appid: this.appid,
          app_type: 0,
          name: this.appName,
          description: "admin 管理后台"
        });
      } else {
        this.addAppidLoading = false;
      }
      this.exportExcelData = data;
    },
    changeSize(e) {
      this.pageSizeIndex = e.detail.value;
    },
    addCurrentAppid(app) {
      db.collection("opendb-app-list").add(app).then((res) => {
        this.loadData();
        setTimeout(() => {
          common_vendor.index.showModal({
            content: `检测到数据库中无当前应用, 已自动添加应用: ${this.appName}`,
            showCancel: false
          });
        }, 500);
      }).catch((err) => {
      }).finally(() => {
        this.addAppidLoading = false;
      });
    },
    getWhere() {
      const query = this.query.trim();
      if (!query) {
        return "";
      }
      const queryRe = new RegExp(query, "i");
      return dbSearchFields.map((name) => queryRe + ".test(" + name + ")").join(" || ");
    },
    search() {
      const newWhere = this.getWhere();
      this.where = newWhere;
      this.loadData();
    },
    loadData(clear = true) {
      this.$refs.udb.loadData({
        clear
      });
    },
    onPageChanged(e) {
      this.selectedIndexs.length = 0;
      this.$refs.table.clearSelection();
      this.$refs.udb.loadData({
        current: e.current
      });
    },
    navigateTo(url, clear) {
      common_vendor.index.navigateTo({
        url,
        events: {
          refreshData: () => {
            this.loadData(clear);
          }
        }
      });
    },
    // 多选处理
    selectedItems() {
      let dataList = this.$refs.udb.dataList;
      return this.selectedIndexs.map((i) => dataList[i]._id);
    },
    // 批量删除
    delTable() {
      common_vendor.index.__f__(
        "warn",
        "at pages/system/app/list.vue:248",
        "删除应用，只能删除应用表 opendb-app-list 中的应用数据记录，不能删除与应用关联的其他数据，例如：使用升级中心 uni-upgrade-center 等插件产生的数据（应用版本数据等）"
      );
      this.$refs.udb.remove(this.selectedItems(), {
        success: (res) => {
          this.$refs.table.clearSelection();
        }
      });
    },
    // 多选
    selectionChange(e) {
      this.selectedIndexs = e.detail.index;
    },
    confirmDelete(id) {
      common_vendor.index.__f__(
        "warn",
        "at pages/system/app/list.vue:262",
        "删除应用，只能删除应用表 opendb-app-list 中的应用数据记录，不能删除与应用关联的其他数据，例如：使用升级中心 uni-upgrade-center 等插件产生的数据（应用版本数据等）"
      );
      this.$refs.udb.remove(id, {
        confirmContent: "是否删除该应用",
        success: (res) => {
          this.$refs.table.clearSelection();
        }
      });
    },
    sortChange(e, name) {
      this.orderByFieldName = name;
      if (e.order) {
        this.orderby = name + " " + orderByMapping[e.order];
      } else {
        this.orderby = "";
      }
      this.$refs.table.clearSelection();
      this.$nextTick(() => {
        this.$refs.udb.loadData();
      });
    },
    filterChange(e, name) {
      this._filter[name] = {
        type: e.filterType,
        value: e.filter
      };
      let newWhere = js_sdk_validator_opendbAppList.filterToWhere(this._filter, db.command);
      if (Object.keys(newWhere).length) {
        this.where = newWhere;
      } else {
        this.where = "";
      }
      this.$nextTick(() => {
        this.$refs.udb.loadData();
      });
    },
    publish(id) {
      common_vendor.index.navigateTo({
        url: "/pages/system/app/uni-portal/uni-portal?id=" + id
      });
    },
    getAppType(app_type = 0) {
      const data = ["uni-app", "uni-app x"];
      return data[app_type] || "未知类型";
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_unicloud_db2 = common_vendor.resolveComponent("unicloud-db");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_dateformat2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_unicloud_db2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_dateformat = () => "../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_unicloud_db = () => "../../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
const _easycom_fix_window = () => "../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_dateformat + _easycom_uni_table + _easycom_uni_pagination + _easycom_unicloud_db + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.search && $options.search(...args)),
    b: _ctx.$t("common.placeholder.query"),
    c: $data.query,
    d: common_vendor.o(($event) => $data.query = $event.detail.value),
    e: common_vendor.t(_ctx.$t("common.button.search")),
    f: common_vendor.o((...args) => $options.search && $options.search(...args)),
    g: common_vendor.t(_ctx.$t("common.button.add")),
    h: common_vendor.o(($event) => $options.navigateTo("./add")),
    i: common_vendor.t(_ctx.$t("common.button.batchDelete")),
    j: !$data.selectedIndexs.length,
    k: common_vendor.o((...args) => $options.delTable && $options.delTable(...args)),
    l: common_vendor.w(({
      data,
      pagination,
      loading,
      error,
      options
    }, s0, i0) => {
      return {
        a: "092686d2-4-" + i0 + "," + ("092686d2-3-" + i0),
        b: "092686d2-5-" + i0 + "," + ("092686d2-3-" + i0),
        c: "092686d2-6-" + i0 + "," + ("092686d2-3-" + i0),
        d: "092686d2-7-" + i0 + "," + ("092686d2-3-" + i0),
        e: "092686d2-8-" + i0 + "," + ("092686d2-3-" + i0),
        f: "092686d2-9-" + i0 + "," + ("092686d2-3-" + i0),
        g: "092686d2-10-" + i0 + "," + ("092686d2-3-" + i0),
        h: "092686d2-3-" + i0 + "," + ("092686d2-2-" + i0),
        i: common_vendor.f(data, (item, index, i1) => {
          return {
            a: common_vendor.t(item.appid),
            b: "092686d2-12-" + i0 + "-" + i1 + "," + ("092686d2-11-" + i0 + "-" + i1),
            c: common_vendor.t($options.getAppType(item.app_type)),
            d: "092686d2-13-" + i0 + "-" + i1 + "," + ("092686d2-11-" + i0 + "-" + i1),
            e: common_vendor.t(item.name),
            f: "092686d2-14-" + i0 + "-" + i1 + "," + ("092686d2-11-" + i0 + "-" + i1),
            g: common_vendor.t(item.description || "-"),
            h: "092686d2-15-" + i0 + "-" + i1 + "," + ("092686d2-11-" + i0 + "-" + i1),
            i: common_vendor.t(item.remark || "-"),
            j: "092686d2-16-" + i0 + "-" + i1 + "," + ("092686d2-11-" + i0 + "-" + i1),
            k: "092686d2-18-" + i0 + "-" + i1 + "," + ("092686d2-17-" + i0 + "-" + i1),
            l: common_vendor.p({
              threshold: [0, 0],
              date: item.create_date
            }),
            m: "092686d2-17-" + i0 + "-" + i1 + "," + ("092686d2-11-" + i0 + "-" + i1),
            n: common_vendor.o(($event) => $options.publish(item._id), index),
            o: common_vendor.o(($event) => $options.navigateTo("/uni_modules/uni-upgrade-center/pages/version/list?appid=" + item.appid, false), index),
            p: common_vendor.o(($event) => $options.navigateTo("./add?id=" + item.appid, false), index),
            q: common_vendor.o(($event) => $options.confirmDelete(item._id), index),
            r: "092686d2-19-" + i0 + "-" + i1 + "," + ("092686d2-11-" + i0 + "-" + i1),
            s: index,
            t: "092686d2-11-" + i0 + "-" + i1 + "," + ("092686d2-2-" + i0),
            v: common_vendor.p({
              disabled: item.appid === _ctx.appid
            })
          };
        }),
        j: common_vendor.sr("table", "092686d2-2-" + i0 + ",092686d2-1"),
        k: "092686d2-2-" + i0 + ",092686d2-1",
        l: common_vendor.p({
          loading: loading || $data.addAppidLoading,
          emptyText: error.message || _ctx.$t("common.empty"),
          border: true,
          stripe: true,
          type: "selection"
        }),
        m: "092686d2-20-" + i0 + ",092686d2-1",
        n: common_vendor.o(($event) => pagination.current = $event),
        o: common_vendor.p({
          ["show-icon"]: true,
          ["show-page-size"]: true,
          ["page-size"]: pagination.size,
          total: pagination.count,
          modelValue: pagination.current
        }),
        p: i0,
        q: s0
      };
    }, {
      name: "d",
      path: "l",
      vueId: "092686d2-1"
    }),
    m: common_vendor.o(($event) => $options.filterChange($event, "appid")),
    n: common_vendor.o(($event) => $options.sortChange($event, "appid")),
    o: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    p: common_vendor.o(($event) => $options.filterChange($event, "app_type")),
    q: common_vendor.o(($event) => $options.sortChange($event, "app_type")),
    r: common_vendor.p({
      align: "center",
      ["filter-type"]: "select",
      ["filter-data"]: $data.appTypeData,
      sortable: true
    }),
    s: common_vendor.o(($event) => $options.filterChange($event, "name")),
    t: common_vendor.o(($event) => $options.sortChange($event, "name")),
    v: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    w: common_vendor.o(($event) => $options.filterChange($event, "description")),
    x: common_vendor.o(($event) => $options.sortChange($event, "description")),
    y: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true,
      width: $data.descriptionThWidth
    }),
    z: common_vendor.p({
      align: "center"
    }),
    A: common_vendor.o(($event) => $options.filterChange($event, "create_date")),
    B: common_vendor.o(($event) => $options.sortChange($event, "create_date")),
    C: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    D: common_vendor.p({
      align: "center",
      width: $data.buttonThWidth
    }),
    E: common_vendor.p({
      align: "center"
    }),
    F: common_vendor.p({
      align: "center"
    }),
    G: common_vendor.p({
      align: "center"
    }),
    H: common_vendor.p({
      align: "left"
    }),
    I: common_vendor.p({
      align: "left"
    }),
    J: common_vendor.p({
      align: "center"
    }),
    K: common_vendor.t(_ctx.$t("common.button.publish")),
    L: common_vendor.t(_ctx.$t("common.button.version")),
    M: common_vendor.t(_ctx.$t("common.button.edit")),
    N: common_vendor.t(_ctx.$t("common.button.delete")),
    O: common_vendor.p({
      align: "center"
    }),
    P: common_vendor.o($options.selectionChange),
    Q: common_vendor.o($options.onPageChanged),
    R: common_vendor.o($options.pageSizeChange),
    S: common_vendor.sr("udb", "092686d2-1"),
    T: common_vendor.o($options.onqueryload),
    U: common_vendor.p({
      collection: "opendb-app-list",
      field: "appid,app_type,name,description,remark,create_date",
      where: $data.where,
      ["page-data"]: "replace",
      orderby: $data.orderby,
      getcount: true,
      ["page-size"]: $data.options.pageSize,
      ["page-current"]: $data.options.pageCurrent,
      options: $data.options,
      loadtime: "manual"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/system/app/list.js.map
