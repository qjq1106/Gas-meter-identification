"use strict";
const common_vendor = require("../../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../../js_sdk/uni-stat/util.js");
const pages_uniStat_device_trend_fieldsMap = require("./fieldsMap.js");
const _sfc_main = {
  data() {
    return {
      tableName: "uni-stat-result",
      fieldsMap: pages_uniStat_device_trend_fieldsMap.fieldsMap,
      query: {
        dimension: "day",
        appid: "",
        platform_id: "",
        uni_platform: "",
        version_id: "",
        channel_id: "",
        start_time: []
      },
      options: {
        pageSize: 20,
        pageCurrent: 1,
        // 当前页
        total: 0
        // 数据总量
      },
      loading: false,
      currentDateTab: 1,
      currentDimensionTab: 1,
      tableData: [],
      panelData: pages_uniStat_device_trend_fieldsMap.fieldsMap.filter((f) => f.hasOwnProperty("value")),
      chartData: {},
      chartTab: "new_user_count",
      channelData: [],
      tabIndex: 0,
      errorMessage: "",
      setOptions: {
        xAxis: {
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#999"
            }
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        grid: {
          left: 40,
          right: 50,
          bottom: 50,
          top: 60,
          containLabel: true,
          show: false
        }
      }
    };
  },
  computed: {
    chartTabs() {
      const tabs = [];
      pages_uniStat_device_trend_fieldsMap.fieldsMap.forEach((item) => {
        const {
          field: _id,
          title: name
        } = item;
        const isTab = item.hasOwnProperty("value");
        if (_id && name && isTab) {
          tabs.push({
            _id,
            name
          });
        }
      });
      return tabs;
    },
    dimensionTabs() {
      const tabs = [{
        _id: "hour",
        name: "按时"
      }, {
        _id: "day",
        name: "按日"
      }, {
        _id: "week",
        name: "按周"
      }, {
        _id: "month",
        name: "按月"
      }];
      if (!this.getDays()) {
        this.query.dimension = "hour";
        tabs.forEach((tab, index) => {
          if (tab._id === "hour") {
            tab.disabled = false;
          } else {
            tab.disabled = true;
          }
        });
        this.currentDimensionTab = 0;
      } else {
        tabs.forEach((tab, index) => {
          if (tab._id === "hour") {
            tab.disabled = false;
          } else {
            tab.disabled = false;
          }
        });
      }
      return tabs;
    },
    channelQuery() {
      const platform_id = this.query.platform_id;
      return js_sdk_uniStat_util.stringifyQuery({
        platform_id
      });
    },
    versionQuery() {
      const {
        appid,
        uni_platform
      } = this.query;
      const query = js_sdk_uniStat_util.stringifyQuery({
        appid,
        uni_platform
      });
      return query;
    }
  },
  created() {
    this.debounceGet = js_sdk_uniStat_util.debounce(() => {
      this.getAllData(this.query);
    }, 300);
    this.getChannelData();
  },
  watch: {
    query: {
      deep: true,
      handler(val) {
        this.debounceGet();
      }
    }
  },
  methods: {
    getDays() {
      if (!this.query.start_time.length)
        return true;
      const day = 24 * 60 * 60 * 1e3;
      const [start, end] = this.query.start_time;
      const lessTwoDay = end - start >= day;
      return lessTwoDay;
    },
    useDatetimePicker() {
      this.currentDateTab = -1;
    },
    changeAppid(id) {
      this.getChannelData(id, false);
    },
    changePlatform(id, index, name, item) {
      this.getChannelData(null, id);
      this.query.version_id = 0;
      this.query.uni_platform = item.code;
    },
    changeTimeRange(id, index) {
      this.currentDateTab = index;
      const day = 24 * 60 * 60 * 1e3;
      let start, end;
      start = js_sdk_uniStat_util.getTimeOfSomeDayAgo(id);
      if (!id) {
        end = js_sdk_uniStat_util.getTimeOfSomeDayAgo(0) + day - 1;
      } else {
        end = js_sdk_uniStat_util.getTimeOfSomeDayAgo(0) - 1;
      }
      this.query.start_time = [start, end];
    },
    changeDimensionTab(dimension, index) {
      this.currentDimensionTab = index;
      this.query.dimension = dimension;
    },
    changePageCurrent(e) {
      this.options.pageCurrent = e.current;
      this.getTabelData(this.query);
    },
    changePageSize(pageSize) {
      this.options.pageSize = pageSize;
      this.options.pageCurrent = 1;
      this.getTabelData(this.query);
    },
    changeChartTab(id, index, name) {
      this.tabIndex = index;
      this.getChartData(this.query, id, name);
    },
    getAllData(query) {
      if (!query.appid) {
        this.errorMessage = "请先选择应用";
        return;
      }
      this.errorMessage = "";
      this.getPanelData();
      this.getChartData(query);
      this.getTabelData(query);
    },
    getChartData(query, field = this.chartTabs[this.tabIndex]._id, name = this.chartTabs[this.tabIndex].name) {
      query = js_sdk_uniStat_util.stringifyQuery(query, true, ["uni_platform"]);
      const dimension = this.query.dimension;
      const db = common_vendor.tr.database();
      db.collection(this.tableName).where(query).field(`${js_sdk_uniStat_util.stringifyField(pages_uniStat_device_trend_fieldsMap.fieldsMap, field)}, start_time`).groupBy("start_time").groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_device_trend_fieldsMap.fieldsMap, field)).orderBy("start_time", "asc").get({
        getCount: true
      }).then((res) => {
        const {
          count,
          data
        } = res.result;
        const options = {
          categories: [],
          series: [{
            name,
            data: []
          }]
        };
        let mapper = pages_uniStat_device_trend_fieldsMap.fieldsMap.filter((f) => f.field === field);
        mapper = JSON.parse(JSON.stringify(mapper));
        delete mapper[0].value;
        mapper[0].formatter = "";
        for (const item of data) {
          js_sdk_uniStat_util.mapfields(mapper, item, item);
          const x = js_sdk_uniStat_util.formatDate(item.start_time, dimension);
          let y = item[field];
          options.series[0].data.push(y);
          options.categories.push(x);
        }
        this.chartData = options;
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/uni-stat/device/trend/trend.vue:315", err);
      }).finally(() => {
        this.loading = false;
      });
    },
    getTabelData(query) {
      const {
        pageCurrent
      } = this.options;
      query = js_sdk_uniStat_util.stringifyQuery(query, true, ["uni_platform"]);
      common_vendor.index.__f__("log", "at pages/uni-stat/device/trend/trend.vue:328", "query: ", query);
      this.options.pageCurrent = 1;
      this.loading = true;
      const db = common_vendor.tr.database();
      db.collection(this.tableName).where(query).field(js_sdk_uniStat_util.stringifyField(pages_uniStat_device_trend_fieldsMap.fieldsMap)).groupBy("start_time").groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_device_trend_fieldsMap.fieldsMap)).orderBy("start_time", "desc").skip((pageCurrent - 1) * this.options.pageSize).limit(this.options.pageSize).get({
        getCount: true
      }).then((res) => {
        const {
          count,
          data
        } = res.result;
        for (const item of data) {
          let date = item.start_time;
          if (date) {
            const dimension = this.query.dimension;
            item.start_time = js_sdk_uniStat_util.formatDate(date, dimension);
          }
          js_sdk_uniStat_util.mapfields(pages_uniStat_device_trend_fieldsMap.fieldsMap, item, item);
        }
        this.tableData = [];
        this.options.total = count;
        this.tableData = data;
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/uni-stat/device/trend/trend.vue:360", err);
      }).finally(() => {
        this.loading = false;
      });
    },
    getPanelData() {
      let cloneQuery = JSON.parse(JSON.stringify(this.query));
      let query = js_sdk_uniStat_util.stringifyQuery(cloneQuery, false, ["uni_platform"]);
      const db = common_vendor.tr.database();
      db.collection(this.tableName).where(query).field(`${js_sdk_uniStat_util.stringifyField(pages_uniStat_device_trend_fieldsMap.fieldsMap)},stat_date`).groupBy("appid").groupField(js_sdk_uniStat_util.stringifyGroupField(pages_uniStat_device_trend_fieldsMap.fieldsMap)).orderBy("stat_date", "desc").get().then((res) => {
        const item = res.result.data[0];
        item && (item.total_devices = 0);
        js_sdk_uniStat_util.getFieldTotal.call(this, cloneQuery);
        this.panelData = [];
        this.panelData = js_sdk_uniStat_util.mapfields(pages_uniStat_device_trend_fieldsMap.fieldsMap, item);
      });
    },
    navTo(id) {
      const url = `/pages/uni-stat/overview/overview?id=${id}`;
      common_vendor.index.navigateTo({
        url
      });
    },
    //获取渠道信息
    getChannelData(appid, platform_id) {
      this.query.channel_id = "";
      const db = common_vendor.tr.database();
      const condition = {};
      appid = appid ? appid : this.query.appid;
      if (appid) {
        condition.appid = appid;
      }
      platform_id = platform_id ? platform_id : this.query.platform_id;
      if (platform_id) {
        condition.platform_id = platform_id;
      }
      let platformTemp = db.collection("uni-stat-app-platforms").field("_id, name").getTemp();
      let channelTemp = db.collection("uni-stat-app-channels").where(condition).field("_id, channel_name, create_time, platform_id").getTemp();
      db.collection(channelTemp, platformTemp).orderBy("platform_id", "asc").get().then((res) => {
        let data = res.result.data;
        let channels = [];
        if (data.length > 0) {
          let channelName;
          for (let i in data) {
            channelName = data[i].channel_name ? data[i].channel_name : "默认";
            if (data[i].platform_id.length > 0) {
              channelName = data[i].platform_id[0].name + "-" + channelName;
            }
            channels.push({
              value: data[i]._id,
              text: channelName
            });
          }
        }
        this.channelData = channels;
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/uni-stat/device/trend/trend.vue:443", err);
      }).finally(() => {
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_stat_tabs2 = common_vendor.resolveComponent("uni-stat-tabs");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_stat_panel2 = common_vendor.resolveComponent("uni-stat-panel");
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  const _easycom_uni_stat_table2 = common_vendor.resolveComponent("uni-stat-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_data_select2 + _easycom_uni_stat_tabs2 + _easycom_uni_datetime_picker2 + _easycom_uni_stat_panel2 + _easycom_qiun_data_charts2 + _easycom_uni_stat_table2 + _easycom_uni_pagination2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_data_select = () => "../../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_stat_tabs = () => "../../../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_datetime_picker = () => "../../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_stat_panel = () => "../../../../components/uni-stat-panel/uni-stat-panel.js";
const _easycom_qiun_data_charts = () => "../../../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
const _easycom_uni_stat_table = () => "../../../../components/uni-stat-table/uni-stat-table.js";
const _easycom_uni_pagination = () => "../../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_fix_window = () => "../../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_data_select + _easycom_uni_stat_tabs + _easycom_uni_datetime_picker + _easycom_uni_stat_panel + _easycom_qiun_data_charts + _easycom_uni_stat_table + _easycom_uni_pagination + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.changeAppid),
    b: common_vendor.o(($event) => $data.query.appid = $event),
    c: common_vendor.p({
      collection: "opendb-app-list",
      field: "appid as value, name as text",
      orderby: "text asc",
      defItem: 1,
      label: "应用选择",
      clear: false,
      modelValue: $data.query.appid
    }),
    d: common_vendor.o(($event) => $data.query.version_id = $event),
    e: common_vendor.p({
      collection: "opendb-app-versions",
      where: $options.versionQuery,
      field: "_id as value, version as text, uni_platform as label, create_date as date",
      format: "{label} - {text}",
      orderby: "date desc",
      label: "版本选择",
      modelValue: $data.query.version_id
    }),
    f: common_vendor.o($options.changeTimeRange),
    g: common_vendor.p({
      label: "日期选择",
      current: $data.currentDateTab,
      mode: "date"
    }),
    h: $data.currentDateTab < 0 && !!$data.query.start_time.length ? 1 : "",
    i: common_vendor.o($options.useDatetimePicker),
    j: common_vendor.o(($event) => $data.query.start_time = $event),
    k: common_vendor.p({
      type: "datetimerange",
      end: (/* @__PURE__ */ new Date()).getTime(),
      returnType: "timestamp",
      clearIcon: false,
      modelValue: $data.query.start_time
    }),
    l: common_vendor.o($options.changeDimensionTab),
    m: common_vendor.p({
      label: "维度选择",
      type: "box",
      current: $data.currentDimensionTab,
      tabs: $options.dimensionTabs
    }),
    n: common_vendor.o($options.changePlatform),
    o: common_vendor.o(($event) => $data.query.platform_id = $event),
    p: common_vendor.p({
      label: "平台选择",
      type: "boldLine",
      mode: "platform",
      modelValue: $data.query.platform_id
    }),
    q: $data.query.platform_id && $data.query.platform_id.indexOf("==") === -1
  }, $data.query.platform_id && $data.query.platform_id.indexOf("==") === -1 ? {
    r: common_vendor.sr("version-select", "b6839354-7"),
    s: common_vendor.o(($event) => $data.query.channel_id = $event),
    t: common_vendor.p({
      collection: "uni-stat-app-channels",
      where: $options.channelQuery,
      field: "_id as value, channel_name as text",
      orderby: "text asc",
      label: "渠道/场景值选择",
      modelValue: $data.query.channel_id
    })
  } : {}, {
    v: common_vendor.p({
      items: $data.panelData
    }),
    w: common_vendor.o($options.changeChartTab),
    x: common_vendor.o(($event) => $data.chartTab = $event),
    y: common_vendor.p({
      type: "box",
      tabs: $options.chartTabs,
      modelValue: $data.chartTab
    }),
    z: common_vendor.p({
      type: "area",
      chartData: $data.chartData,
      echartsH5: true,
      echartsApp: true,
      errorMessage: $data.errorMessage,
      eopts: $data.setOptions
    }),
    A: common_vendor.p({
      data: $data.tableData,
      filedsMap: $data.fieldsMap,
      loading: $data.loading
    }),
    B: common_vendor.o($options.changePageCurrent),
    C: common_vendor.o($options.changePageSize),
    D: common_vendor.p({
      ["show-icon"]: true,
      ["show-page-size"]: true,
      ["page-size"]: $data.options.pageSize,
      current: $data.options.pageCurrent,
      total: $data.options.total
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/uni-stat/device/trend/trend.js.map
