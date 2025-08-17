"use strict";
function download(data, strFileName, strMimeType) {
  let self = window, defaultMime = "application/octet-stream", mimeType = strMimeType || defaultMime, payload = data, url = !strFileName && !strMimeType && payload, anchor = document.createElement("a"), toString = function(a) {
    return String(a);
  }, myBlob = self.Blob || self.MozBlob || self.WebKitBlob || toString, fileName = strFileName || "download", blob, reader;
  myBlob = myBlob.call ? myBlob.bind(self) : Blob;
  if (String(this) === "true") {
    payload = [payload, mimeType];
    mimeType = payload[0];
    payload = payload[1];
  }
  if (url && url.length < 2048) {
    fileName = url.split("/").pop().split("?")[0];
    anchor.href = url;
    if (anchor.href.indexOf(url) !== -1) {
      let ajax = new XMLHttpRequest();
      ajax.open("GET", url, true);
      ajax.responseType = "blob";
      ajax.onload = function(e) {
        download(e.target.response, fileName, defaultMime);
      };
      setTimeout(function() {
        ajax.send();
      }, 0);
      return ajax;
    }
  }
  if (/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(payload)) {
    if (payload.length > 1024 * 1024 * 1.999 && myBlob !== toString) {
      payload = dataUrlToBlob(payload);
      mimeType = payload.type || defaultMime;
    } else {
      return navigator.msSaveBlob ? (
        // IE10 can't do a[download], only Blobs:
        navigator.msSaveBlob(dataUrlToBlob(payload), fileName)
      ) : saver(payload);
    }
  } else {
    if (/([\x80-\xff])/.test(payload)) {
      let i = 0, tempUiArr = new Uint8Array(payload.length), mx = tempUiArr.length;
      for (i; i < mx; ++i)
        tempUiArr[i] = payload.charCodeAt(i);
      payload = new myBlob([tempUiArr], { type: mimeType });
    }
  }
  blob = payload instanceof myBlob ? payload : new myBlob([payload], { type: mimeType });
  function dataUrlToBlob(strUrl) {
    let parts = strUrl.split(/[:;,]/), type = parts[1], decoder = parts[2] == "base64" ? atob : decodeURIComponent, binData = decoder(parts.pop()), mx = binData.length, i = 0, uiArr = new Uint8Array(mx);
    for (i; i < mx; ++i)
      uiArr[i] = binData.charCodeAt(i);
    return new myBlob([uiArr], { type });
  }
  function saver(url2, winMode) {
    if ("download" in anchor) {
      anchor.href = url2;
      anchor.setAttribute("download", fileName);
      anchor.className = "download-js-link";
      anchor.innerHTML = "downloading...";
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      setTimeout(function() {
        anchor.click();
        document.body.removeChild(anchor);
        if (winMode === true) {
          setTimeout(function() {
            self.URL.revokeObjectURL(anchor.href);
          }, 250);
        }
      }, 66);
      return true;
    }
    if (/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
      if (/^data:/.test(url2))
        url2 = "data:" + url2.replace(/^data:([\w\/\-\+]+)/, defaultMime);
      if (!window.open(url2)) {
        if (confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")) {
          location.href = url2;
        }
      }
      return true;
    }
    let f = document.createElement("iframe");
    document.body.appendChild(f);
    if (!winMode && /^data:/.test(url2)) {
      url2 = "data:" + url2.replace(/^data:([\w\/\-\+]+)/, defaultMime);
    }
    f.src = url2;
    setTimeout(function() {
      document.body.removeChild(f);
    }, 333);
  }
  if (navigator.msSaveBlob) {
    return navigator.msSaveBlob(blob, fileName);
  }
  if (self.URL) {
    saver(self.URL.createObjectURL(blob), true);
  } else {
    if (typeof blob === "string" || blob.constructor === toString) {
      try {
        return saver("data:" + mimeType + ";base64," + self.btoa(blob));
      } catch (y) {
        return saver("data:" + mimeType + "," + encodeURIComponent(blob));
      }
    }
    reader = new FileReader();
    reader.onload = function(e) {
      saver(this.result);
    };
    reader.readAsDataURL(blob);
  }
  return true;
}
exports.download = download;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/download-excel/download.js.map
