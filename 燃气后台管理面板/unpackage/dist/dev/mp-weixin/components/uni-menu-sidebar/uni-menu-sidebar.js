"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "uniMenuSidebar",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
if (!Array) {
  const _easycom_uni_menu_item2 = common_vendor.resolveComponent("uni-menu-item");
  const _easycom_uni_menu_sidebar2 = common_vendor.resolveComponent("uni-menu-sidebar");
  const _easycom_uni_sub_menu2 = common_vendor.resolveComponent("uni-sub-menu");
  (_easycom_uni_menu_item2 + _easycom_uni_menu_sidebar2 + _easycom_uni_sub_menu2)();
}
const _easycom_uni_menu_item = () => "../uni-menu-item/uni-menu-item.js";
const _easycom_uni_menu_sidebar = () => Promise.resolve().then(() => RTovdGVzdFByb2plY3RzL1dlQ2hhdFByb2plY3RzL3Rlc3RQcm9qZWN0LTIv54eD5rCU5ZCO5YW566h55CG6Z2i5p2_L2NvbXBvbmVudHMvdW5pLW1lbnUtc2lkZWJhci91bmktbWVudS1zaWRlYmFyLnZ1ZQ);
const _easycom_uni_sub_menu = () => "../uni-sub-menu/uni-sub-menu.js";
if (!Math) {
  (_easycom_uni_menu_item + _easycom_uni_menu_sidebar + _easycom_uni_sub_menu)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.data, (item, index, i0) => {
      return common_vendor.e({
        a: !item.children || !item.children.length
      }, !item.children || !item.children.length ? {
        b: common_vendor.n(item.icon),
        c: common_vendor.t(item.text),
        d: item.icon ? 1 : "",
        e: "9365e216-0-" + i0,
        f: common_vendor.p({
          index: item
        })
      } : {
        g: common_vendor.n(item.icon),
        h: common_vendor.t(item.text),
        i: item.icon ? 1 : "",
        j: item._id,
        k: "9365e216-2-" + i0 + "," + ("9365e216-1-" + i0),
        l: common_vendor.p({
          data: item.children
        }),
        m: "9365e216-1-" + i0,
        n: common_vendor.p({
          index: item
        })
      }, {
        o: index
      });
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
const RTovdGVzdFByb2plY3RzL1dlQ2hhdFByb2plY3RzL3Rlc3RQcm9qZWN0LTIv54eD5rCU5ZCO5YW566h55CG6Z2i5p2_L2NvbXBvbmVudHMvdW5pLW1lbnUtc2lkZWJhci91bmktbWVudS1zaWRlYmFyLnZ1ZQ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/uni-menu-sidebar/uni-menu-sidebar.js.map
