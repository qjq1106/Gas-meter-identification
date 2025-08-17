"use strict";
const PLATFORM = [
  {
    "value": "Android",
    "text": "安卓"
  },
  {
    "value": "iOS",
    "text": "苹果"
  },
  {
    "value": "Harmony",
    "text": "鸿蒙 Next"
  }
];
const validator = {
  "appid": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "AppID"
  },
  "name": {
    "rules": [{
      "format": "string"
    }],
    "label": "应用名称"
  },
  "title": {
    "rules": [{
      "format": "string"
    }],
    "label": "更新标题"
  },
  "contents": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "更新内容"
  },
  "platform": {
    "rules": [
      {
        "required": true
      },
      /* 此处不校验数据类型，因为platform在发布app端是单选，在发布wgt时可能是多选
      {
      	"format": "array"
      }, */
      {
        "range": PLATFORM
      }
    ],
    "label": "平台"
  },
  "type": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      },
      {
        "range": [
          {
            "value": "native_app",
            "text": "原生App安装包"
          },
          {
            "value": "wgt",
            "text": "wgt资源包"
          }
        ]
      }
    ],
    "label": "安装包类型"
  },
  "version": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "版本号"
  },
  "min_uni_version": {
    "rules": [{
      "format": "string"
    }],
    "label": "原生App最低版本"
  },
  "url": {
    "rules": [{
      "required": true
    }, {
      "format": "string"
    }],
    "label": "链接"
  },
  "stable_publish": {
    "rules": [{
      "format": "bool"
    }],
    "label": "上线发行"
  },
  "create_date": {
    "rules": [{
      "format": "timestamp"
    }],
    "label": "上传时间"
  },
  "is_silently": {
    "rules": [{
      "format": "bool"
    }],
    "label": "静默更新",
    "defaultValue": false
  },
  "is_mandatory": {
    "rules": [{
      "format": "bool"
    }],
    "label": "强制更新",
    "defaultValue": false
  },
  "uni_platform": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "uni 平台"
  },
  "create_env": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ]
  },
  "store_list": {
    "rules": [{
      "format": "array"
    }],
    "label": "应用市场"
  }
};
const enumConverter = {
  "platform_valuetotext": PLATFORM,
  "type_valuetotext": {
    "native_app": "原生App安装包",
    "wgt": "wgt资源包"
  }
};
exports.enumConverter = enumConverter;
exports.validator = validator;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/js_sdk/validator/opendb-app-versions.js.map
