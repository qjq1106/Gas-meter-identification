"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      imageUrl: "",
      recognizing: false,
      todayCount: 0,
      totalCount: 0,
      showForm: false,
      buildingIndex: 0,
      buildingOptions: ["1号楼", "2号楼", "3号楼", "4号楼", "5号楼", "6号楼", "7号楼", "8号楼", "9号楼", "10号楼", "11号楼", "12号楼"],
      formData: {
        building: "1号楼",
        detailAddress: "",
        remarks: ""
      },
      shootingTips: [
        {
          title: "光线充足",
          desc: "确保燃气表数字显示清晰",
          emoji: "💡"
        },
        {
          title: "水平拍摄",
          desc: "保持手机与燃气表平行",
          emoji: "📐"
        },
        {
          title: "完整显示",
          desc: "确保读数完全显示在画面中",
          emoji: "🎯"
        },
        {
          title: "避免反光",
          desc: "防止阴影遮挡数字区域",
          emoji: "🚫"
        },
        {
          title: "核对读数",
          desc: "识别后请验证结果准确性",
          emoji: "✅"
        }
      ]
    };
  },
  onLoad() {
    this.loadStatistics();
  },
  onShow() {
    this.loadStatistics();
  },
  methods: {
    // 加载统计数据
    async loadStatistics() {
      try {
        const gasMeter = common_vendor.tr.importObject("gasMeter");
        const result = await gasMeter.getReports("全部");
        if (result.errCode === 0) {
          const reports = result.data;
          this.totalCount = reports.length;
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          const todayFormatted = today.replace(/-/g, "/");
          this.todayCount = reports.filter((report) => {
            return report.date === todayFormatted || report.updateTime && report.updateTime.startsWith(today);
          }).length;
        }
      } catch (error) {
        common_vendor.index.__f__("log", "at pages/recognize/recognize.vue:221", "加载统计数据失败:", error);
      }
    },
    // 选择图片
    chooseImage() {
      const that = this;
      common_vendor.index.showActionSheet({
        itemList: ["拍照", "从相册选择"],
        success(res) {
          if (res.tapIndex === 0) {
            that.takePhoto();
          } else {
            that.chooseFromAlbum();
          }
        }
      });
    },
    // 拍照
    takePhoto() {
      const that = this;
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["camera"],
        success(res) {
          that.imageUrl = res.tempFilePaths[0];
          common_vendor.index.showToast({
            title: "拍照成功，请继续填写信息",
            icon: "success",
            duration: 1500
          });
        },
        fail() {
          common_vendor.index.showToast({
            title: "拍照失败，请重试",
            icon: "none",
            duration: 2e3
          });
        }
      });
    },
    // 从相册选择
    chooseFromAlbum() {
      const that = this;
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["album"],
        success(res) {
          that.imageUrl = res.tempFilePaths[0];
          common_vendor.index.showToast({
            title: "图片选择成功，请继续填写信息",
            icon: "success",
            duration: 1500
          });
        },
        fail() {
          common_vendor.index.showToast({
            title: "选择图片失败，请重试",
            icon: "none",
            duration: 2e3
          });
        }
      });
    },
    // 清除图片
    clearImage() {
      this.imageUrl = "";
      this.showForm = false;
      this.formData = {
        building: "1号楼",
        detailAddress: "",
        remarks: ""
      };
      this.buildingIndex = 0;
    },
    // 显示信息填写表单
    showInfoForm() {
      this.showForm = true;
    },
    // 返回照片选择
    backToPhoto() {
      this.showForm = false;
    },
    // 楼栋选择变化
    onBuildingChange(e) {
      this.buildingIndex = e.detail.value;
      this.formData.building = this.buildingOptions[e.detail.value];
    },
    // 确认信息并识别图片
    async confirmAndRecognize() {
      if (!this.imageUrl) {
        common_vendor.index.showToast({
          title: "请先选择图片",
          icon: "none"
        });
        return;
      }
      if (!this.formData.detailAddress.trim()) {
        common_vendor.index.showToast({
          title: "请填写详细地址信息",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      this.recognizing = true;
      try {
        const imageBase64 = await this.convertImageToBase64(this.imageUrl);
        let uploadedImageUrl = "";
        try {
          const uploadResult = await common_vendor.tr.uploadFile({
            filePath: this.imageUrl,
            cloudPath: `gas-meter-images/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`,
            cloudPathAsRealPath: true
          });
          uploadedImageUrl = uploadResult.fileID;
        } catch (uploadError) {
          common_vendor.index.__f__("log", "at pages/recognize/recognize.vue:352", "图片上传失败，继续进行识别但不保存图片URL:", uploadError);
        }
        const gasMeter = common_vendor.tr.importObject("gasMeter");
        const fullAddress = `${this.formData.building} ${this.formData.detailAddress}`;
        const result = await gasMeter.recognizeGasMeter(
          imageBase64,
          fullAddress,
          this.formData.building,
          this.formData.remarks,
          uploadedImageUrl
        );
        this.recognizing = false;
        if (result.errCode === 0) {
          this.todayCount++;
          this.totalCount++;
          common_vendor.index.showToast({
            title: "🎉 识别成功！正在生成报告...",
            icon: "success",
            duration: 2e3
          });
          const currentImageUrl = this.imageUrl;
          const currentRemarks = this.formData.remarks;
          this.showForm = false;
          this.imageUrl = "";
          this.formData = {
            building: "1号楼",
            detailAddress: "",
            remarks: ""
          };
          this.buildingIndex = 0;
          setTimeout(() => {
            common_vendor.index.navigateTo({
              url: `/pages/reportDetail/reportDetail?reportId=${result.data.reportId}&reading=${result.data.reading}&address=${result.data.address}&date=${result.data.date}&time=${result.data.time}&imageUrl=${encodeURIComponent(currentImageUrl)}&integerPart=${result.data.integerPart}&decimalPart=${result.data.decimalPart}&remarks=${encodeURIComponent(currentRemarks)}`
            });
          }, 1500);
        } else {
          common_vendor.index.showModal({
            title: "识别失败",
            content: result.errMsg || "无法识别燃气表读数，请检查图片是否清晰，确保数字显示完整。",
            confirmText: "重新拍照",
            showCancel: true,
            cancelText: "稍后再试",
            success: (modalRes) => {
              if (modalRes.confirm) {
                this.clearImage();
              }
            }
          });
        }
      } catch (error) {
        this.recognizing = false;
        common_vendor.index.__f__("error", "at pages/recognize/recognize.vue:420", "识别出错:", error);
        common_vendor.index.showModal({
          title: "网络错误",
          content: "识别过程中网络异常，请检查网络连接后重试。",
          confirmText: "重新识别",
          showCancel: true,
          cancelText: "稍后再试",
          success: (modalRes) => {
            if (modalRes.confirm) {
              this.confirmAndRecognize();
            }
          }
        });
      }
    },
    // 将图片转换为base64编码
    convertImageToBase64(imagePath) {
      return new Promise((resolve, reject) => {
        common_vendor.index.getFileSystemManager().readFile({
          filePath: imagePath,
          encoding: "base64",
          success: (res) => {
            resolve(res.data);
          },
          fail: (error) => {
            reject(error);
          }
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.imageUrl
  }, !$data.imageUrl ? {} : {
    b: $data.imageUrl
  }, {
    c: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    d: !$data.imageUrl
  }, !$data.imageUrl ? {
    e: common_vendor.o((...args) => $options.takePhoto && $options.takePhoto(...args)),
    f: common_vendor.o((...args) => $options.chooseFromAlbum && $options.chooseFromAlbum(...args))
  } : {}, {
    g: $data.imageUrl && !$data.showForm
  }, $data.imageUrl && !$data.showForm ? {
    h: common_vendor.o((...args) => $options.clearImage && $options.clearImage(...args)),
    i: common_vendor.o((...args) => $options.showInfoForm && $options.showInfoForm(...args))
  } : {}, {
    j: $data.showForm
  }, $data.showForm ? {
    k: common_vendor.t($data.buildingOptions[$data.buildingIndex]),
    l: common_vendor.o((...args) => $options.onBuildingChange && $options.onBuildingChange(...args)),
    m: $data.buildingIndex,
    n: $data.buildingOptions,
    o: $data.formData.detailAddress,
    p: common_vendor.o(($event) => $data.formData.detailAddress = $event.detail.value),
    q: $data.formData.remarks,
    r: common_vendor.o(($event) => $data.formData.remarks = $event.detail.value),
    s: common_vendor.o((...args) => $options.backToPhoto && $options.backToPhoto(...args)),
    t: common_vendor.t($data.recognizing ? "⏳" : "✨"),
    v: common_vendor.t($data.recognizing ? "识别中..." : "确认识别"),
    w: $data.recognizing ? 1 : "",
    x: common_vendor.o((...args) => $options.confirmAndRecognize && $options.confirmAndRecognize(...args))
  } : {}, {
    y: common_vendor.f($data.shootingTips, (tip, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(tip.title),
        c: common_vendor.t(tip.desc),
        d: common_vendor.t(tip.emoji),
        e: index
      };
    }),
    z: common_vendor.t($data.todayCount),
    A: common_vendor.t($data.totalCount)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e8b66319"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/recognize/recognize.js.map
