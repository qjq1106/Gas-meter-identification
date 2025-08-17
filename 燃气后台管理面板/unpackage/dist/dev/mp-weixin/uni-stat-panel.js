"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  name: "uni-stat-panel",
  data() {
    return {};
  },
  props: {
    items: {
      type: Array,
      default: () => {
        return [];
      }
    },
    contrast: {
      type: Boolean,
      default: false
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.items, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.title ? item.title : ""),
        b: common_vendor.t(item.value ? item.value : 0)
      }, $props.contrast ? {
        c: common_vendor.t(item.contrast ? item.contrast : 0)
      } : {}, {
        d: index,
        e: common_vendor.n(item.value === "今天" ? "uni-stat--sum-item-width" : "")
      });
    }),
    b: $props.contrast
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
exports.Component = Component;
//# sourceMappingURL=../.sourcemap/mp-weixin/uni-stat-panel.js.map
