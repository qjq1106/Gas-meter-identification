"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const js_sdk_uniStat_util = require("../../../../../js_sdk/uni-stat/util.js");
const js_sdk_uniStat_timeUtil = require("../../../../../js_sdk/uni-stat/timeUtil.js");
const pages_uniStat_payOrder_overview_fieldsMap = require("../fieldsMap.js");
let statTabsList = [];
pages_uniStat_payOrder_overview_fieldsMap.fieldsGroupMap.forEach((item) => {
  const _id = item.group;
  const name = item.title;
  if (_id && name) {
    statTabsList.push({
      _id,
      name,
      list: item.list
    });
  }
});
const _sfc_main = {
  props: {
    query: {
      type: [Object],
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      tableName: "uni-stat-pay-result",
      chartData: {},
      errorMessage: "",
      opts: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [15, 15, 0, 15],
        legend: {},
        enableScroll: true,
        dataLabel: false,
        // 是否显示数据标签
        xAxis: {
          disableGrid: true,
          itemCount: 24,
          fontSize: 12,
          boundaryGap: "center"
          // center justify
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2,
          data: [
            {
              tofix: 2
            }
          ]
        },
        extra: {
          area: {
            type: "straight",
            opacity: 0.2,
            addLine: true,
            width: 2,
            gradient: false
          }
        },
        legend: {
          position: "bottom"
        }
      },
      // 时间选项
      dateTabs: {
        time: [],
        timeStr: "",
        index: 2,
        // 默认最近7天
        list: [
          { _id: 1, name: "昨天", dimension: "hour" },
          { _id: 0, name: "今天", dimension: "hour" },
          { _id: 7, name: "最近七天", dimension: "day" },
          { _id: 30, name: "最近30天", dimension: "day" },
          { _id: 90, name: "最近90天", dimension: "day" },
          { _id: 372, name: "月纬度", dimension: "month" },
          { _id: 1116, name: "季纬度", dimension: "quarter" },
          { _id: 4392, name: "年纬度", dimension: "year" }
        ]
      },
      statTabs: {
        index: 0,
        list: statTabsList
      },
      queryMode: 0
    };
  },
  created() {
    this.getCloudDataDebounce = js_sdk_uniStat_util.debounce(() => {
      this.getCloudData();
    }, 300);
    this.getCloudDataDebounce();
  },
  methods: {
    // 获取云端数据
    getCloudData(obj = {}) {
      let query = this.query;
      if (!query.appid) {
        this.errorMessage = "请先选择应用";
        return;
      }
      this.errorMessage = "";
      let insideQuery = this.getWhere();
      let where = {
        ...query,
        ...insideQuery
      };
      let fieldsMap = this.statTabs.list[this.statTabs.index].list;
      where = js_sdk_uniStat_util.stringifyQuery(where, true, ["uni_platform"]);
      const db = common_vendor.tr.database();
      db.collection(this.tableName).where(where).field(`${js_sdk_uniStat_util.stringifyField(fieldsMap)}, start_time`).groupBy(`start_time`).groupField(js_sdk_uniStat_util.stringifyGroupField(fieldsMap)).orderBy("start_time", "asc").limit(100).get({
        getCount: true
      }).then((res) => {
        let {
          count,
          data
        } = res.result;
        data = js_sdk_uniStat_util.fillTrendChartData(data, insideQuery, fieldsMap);
        data = js_sdk_uniStat_util.formatterData({
          fieldsMap,
          data,
          formatter: false
        });
        this.setChartData(data, fieldsMap, insideQuery);
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/uni-stat/pay-order/overview/components/trendChart.vue:164", err);
      }).finally(() => {
      });
    },
    // 设置图表数据
    setChartData(data, fieldsMap, insideQuery) {
      let chartData = {
        categories: [],
        series: []
      };
      fieldsMap.map((item, index) => {
        if (item.trendChart) {
          chartData.series.push({
            name: item.title,
            data: []
          });
        }
      });
      for (const item of data) {
        const x = this.formatDate(item.start_time, insideQuery.dimension);
        chartData.categories.push(x);
        fieldsMap.map((item2, index) => {
          if (item2.trendChart) {
            let y = Number(item[item2.field]);
            chartData.series[index].data.push(y);
          }
        });
      }
      this.chartData = chartData;
    },
    formatDate(date, type) {
      let d = new Date(date);
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      d.getDate();
      let hour = d.getHours();
      let quarter = Math.floor((d.getMonth() + 3) / 3);
      if (month < 10)
        month = "0" + month;
      if (type === "hour") {
        return `${hour}时`;
      } else if (type === "month") {
        return `${year}-${month}`;
      } else if (type === "quarter") {
        return `${year}/Q${quarter}`;
      } else if (type === "year") {
        return `${year}`;
      } else {
        return js_sdk_uniStat_util.parseDateTime(d);
      }
    },
    // 监听 - 日期选择更改
    datePickerChange(time) {
      this.dateTabs.time = time;
      this.queryMode = 1;
      this.getCloudData();
    },
    // 监听 - 日期选择更改
    dateTabsChange(id, index) {
      this.dateTabs.index = index;
      this.queryMode = 0;
      this.getCloudData();
    },
    // 监听 - 统计字段纬度更改
    statTabsChange(id, index, name) {
      this.statTabs.index = index;
      this.getCloudData({
        field: id,
        name
      });
    },
    // 获取查询条件
    getWhere() {
      let start_time = [];
      let item = this.dateTabs.list[this.dateTabs.index] || {};
      if (typeof item._id === "number" && this.queryMode === 0) {
        let start = js_sdk_uniStat_util.getTimeOfSomeDayAgo(item._id);
        let end = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("day", 0).endTime;
        if (item._id == 1) {
          end = js_sdk_uniStat_timeUtil.timeUtil.getOffsetStartAndEnd("day", 0, start).endTime;
        }
        start_time = [start, end];
      } else if (this.dateTabs.time) {
        start_time = this.dateTabs.time;
      }
      let dimension = item.dimension || "day";
      this.dateTabs.timeStr = `${js_sdk_uniStat_timeUtil.timeUtil.timeFormat(start_time[0])} ~ ${js_sdk_uniStat_timeUtil.timeUtil.timeFormat(start_time[1])}`;
      this.dateTabs.time = start_time;
      return {
        dimension,
        // 时间纬度
        start_time
        // 时间范围
      };
    }
  },
  watch: {
    query: {
      deep: true,
      handler(val) {
        this.getCloudDataDebounce();
      }
    }
  },
  computed: {}
};
if (!Array) {
  const _easycom_uni_stat_tabs2 = common_vendor.resolveComponent("uni-stat-tabs");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  (_easycom_uni_stat_tabs2 + _easycom_uni_datetime_picker2 + _easycom_qiun_data_charts2)();
}
const _easycom_uni_stat_tabs = () => "../../../../../components/uni-stat-tabs/uni-stat-tabs.js";
const _easycom_uni_datetime_picker = () => "../../../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_qiun_data_charts = () => "../../../../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
if (!Math) {
  (_easycom_uni_stat_tabs + _easycom_uni_datetime_picker + _easycom_qiun_data_charts)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.dateTabsChange),
    b: common_vendor.p({
      type: "box",
      current: $data.dateTabs.index,
      tabs: $data.dateTabs.list
    }),
    c: common_vendor.o($options.datePickerChange),
    d: common_vendor.o(($event) => $data.dateTabs.time = $event),
    e: common_vendor.p({
      type: "datetimerange",
      end: Date.now(),
      ["return-type"]: "timestamp",
      ["clear-icon"]: false,
      modelValue: $data.dateTabs.time
    }),
    f: common_vendor.o($options.statTabsChange),
    g: common_vendor.p({
      type: "box",
      current: $data.statTabs.index,
      tabs: $data.statTabs.list
    }),
    h: common_vendor.p({
      type: "area",
      chartData: $data.chartData,
      opts: $data.opts,
      errorMessage: $data.errorMessage
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0245d718"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/uni-stat/pay-order/overview/components/trendChart.js.map
