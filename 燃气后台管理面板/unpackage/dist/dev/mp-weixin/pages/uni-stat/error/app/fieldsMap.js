"use strict";
const fieldsMap = [
  {
    title: "报错时间",
    field: "create_time",
    tooltip: "",
    formatter: "",
    filter: "timestamp"
  },
  {
    title: "错误信息",
    field: "error_msg",
    formatter: "",
    filter: "search"
  },
  {
    title: "原生应用包名",
    field: "package_name",
    formatter: "",
    filter: "search"
  },
  {
    title: "用户端上报的应用版本号",
    field: "version",
    formatter: "",
    tooltip: "manifest.json中的versionName的值",
    filter: "search"
  },
  {
    title: "平台",
    field: "platform",
    formatter: "",
    tooltip: "用户端上报的平台code",
    filter: "search"
  },
  {
    title: "渠道",
    field: "channel",
    formatter: "",
    tooltip: "用户端上报的渠道code场景值",
    filter: "search"
  },
  {
    title: "基础库版本号",
    field: "sdk_version",
    formatter: "",
    tooltip: "",
    filter: "search"
  },
  {
    title: "设备标识",
    field: "device_id",
    formatter: "",
    tooltip: "客户端携带的设备标识",
    filter: "search"
  },
  {
    title: "设备网络型号",
    field: "device_net",
    formatter: "",
    tooltip: "设备网络型号wifi/3G/4G/",
    filter: "search"
  },
  {
    title: "系统版本",
    field: "device_os",
    formatter: "",
    tooltip: "iOS平台为系统版本号，如15.1；Android平台为API等级，如30",
    filter: "search"
  },
  {
    title: "系统版本名称",
    field: "device_os_version",
    formatter: "",
    tooltip: "iOS平台与os字段一致；Android平台为版本名称，如5.1.1",
    filter: "search"
  },
  {
    title: "设备供应商",
    field: "device_vendor",
    formatter: "",
    tooltip: "",
    filter: "search"
  },
  {
    title: "设备型号",
    field: "device_model",
    formatter: "",
    tooltip: "",
    filter: "search"
  },
  {
    title: "是否root",
    field: "device_is_root",
    formatter: "",
    tooltip: "1表示root；0表示未root",
    filter: "range"
  },
  {
    title: "系统名称",
    field: "device_os_name",
    formatter: "",
    tooltip: "用于区别Android和鸿蒙，仅Android支持",
    filter: "search"
  },
  {
    title: "设备电池电量",
    field: "device_batt_level",
    formatter: "",
    tooltip: "取值范围0-100，仅Android支持",
    filter: "range"
  },
  {
    title: "电池温度",
    field: "device_batt_temp",
    formatter: "",
    tooltip: "仅Android支持",
    filter: "search"
  },
  {
    title: "系统已使用内存",
    field: "device_memory_use_size",
    formatter: "",
    tooltip: "单位为Byte，仅Android支持",
    filter: "range"
  },
  {
    title: "系统总内存",
    field: "device_memory_total_size",
    formatter: "",
    tooltip: "单位为Byte，仅Android支持",
    filter: "range"
  },
  {
    title: "系统磁盘已使用大小",
    field: "device_disk_use_size",
    formatter: "",
    tooltip: "单位为Byte，仅Android支持",
    filter: "range"
  },
  {
    title: "系统磁盘总大小",
    field: "device_disk_total_size",
    formatter: "",
    tooltip: "单位为Byte，仅Android支持",
    filter: "range"
  },
  {
    title: "设备支持的CPU架构",
    field: "device_abis",
    formatter: "",
    tooltip: "多个使用,分割，如arm64-v8a,armeabi-v7a,armeabi，仅Android支持",
    filter: "search"
  },
  {
    title: "运行的app个数",
    field: "app_count",
    formatter: "",
    tooltip: "包括运行的uni小程序数目，独立App时值为1",
    filter: "range"
  },
  {
    title: "APP使用的内存量",
    field: "app_use_memory_size",
    formatter: "",
    tooltip: "单位为Byte",
    filter: "range"
  },
  {
    title: "运行应用的个数",
    field: "app_count",
    formatter: "",
    filter: "range"
  },
  {
    title: "打开 Webview 的个数",
    field: "app_webview_count",
    formatter: "",
    filter: "range"
  },
  {
    title: "APP使用时长",
    field: "app_use_duration",
    formatter: "",
    tooltip: "单位为s",
    filter: "range"
  },
  {
    title: "是否前台运行",
    field: "app_run_fore",
    formatter: "",
    tooltip: "1表示前台运行，0表示后台运行",
    filter: "search"
  },
  {
    title: "原生应用版本名称",
    field: "package_version",
    formatter: "",
    tooltip: "Android的apk版本名称；iOS的ipa版本名称",
    filter: "search"
  },
  // {
  // 	title: 'APP使用的内存量',
  // 	field: 'app_use_memory_size',
  // 	formatter: '',
  // 	tooltip: '单位为Byte',
  // 	filter: "search"
  // },
  {
    title: "页面url",
    field: "page_url",
    formatter: "",
    filter: "search"
  }
];
exports.fieldsMap = fieldsMap;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/uni-stat/error/app/fieldsMap.js.map
