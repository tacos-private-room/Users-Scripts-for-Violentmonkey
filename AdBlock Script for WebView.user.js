// ==UserScript==
// @name               AdBlock Script for WebView
// @name:zh-CN         套壳油猴的广告拦截脚本
// @author             Lemon399
// @version            2.3.0
// @description        Parse ABP Cosmetic rules to CSS and apply it.
// @description:zh-CN  将 ABP 中的元素隐藏规则转换为 CSS 使用
// @require            https://greasyfork.org/scripts/452263-extended-css/code/extended-css.js?version=1099366
// @resource           jiekouAD https://code.gitlink.org.cn/damengzhu/banad/raw/branch/main/jiekouAD.txt
// @resource           CSSRule https://code.gitlink.org.cn/damengzhu/abpmerge/raw/branch/main/CSSRule.txt
// @match              *://*/*
// @run-at             document-start
// @grant              unsafeWindow
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @grant              GM_getValue
// @grant              GM_deleteValue
// @grant              GM_setValue
// @grant              GM_xmlhttpRequest
// @grant              GM_getResourceText
// @grant              GM_addStyle
// @namespace          https://lemon399-bitbucket-io.vercel.app/
// @source             https://gitee.com/lemon399/tampermonkey-cli/tree/master/projects/abp_parse
// @connect            code.gitlink.org.cn
// @copyright          GPL-3.0
// @license            GPL-3.0
// ==/UserScript==

(function (vm, ExtendedCss) {
  "use strict";

  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }

  const onlineRules = [];
  onlineRules.push(
    {
      标识: "jiekouAD",
      地址: "https://code.gitlink.org.cn/damengzhu/banad/raw/branch/main/jiekouAD.txt",
      在线更新: !!1,
      筛选后存储: !!1,
    },
    {
      标识: "CSSRule",
      地址: "https://code.gitlink.org.cn/damengzhu/abpmerge/raw/branch/main/CSSRule.txt",
      在线更新: !!1,
      筛选后存储: !!0,
    }
  );
  let defaultRules = `
! 没有 ## #@# #?# #@?#
! #$# #@$# #$?# #@$?# 的行和
! 开头为 ! 的行会忽略
!
! 由于语法限制，内置规则中
! 一个反斜杠需要改成两个，像这样 \\
!
! 若要修改地址，请注意同步修改
! 头部的 @connect 和 @resource

`;

  const ruleRE = [
    /^(~?[\w-]+(\.[\w-]+)*(\.[\w-]+|\.\*)(,~?[\w-]+(\.[\w-]+)*(\.[\w-]+|\.\*))*)?##([^\s^+].*)/,
    /^(~?[\w-]+(\.[\w-]+)*(\.[\w-]+|\.\*)(,~?[\w-]+(\.[\w-]+)*(\.[\w-]+|\.\*))*)?#@#([^\s+].*)/,
    /^(~?[\w-]+(\.[\w-]+)*(\.[\w-]+|\.\*)(,~?[\w-]+(\.[\w-]+)*(\.[\w-]+|\.\*))*)?#\?#([^\s].*)/,
    /^(~?[\w-]+(\.[\w-]+)*(\.[\w-]+|\.\*)(,~?[\w-]+(\.[\w-]+)*(\.[\w-]+|\.\*))*)?#@\?#([^\s].*)/,
    /^(~?[\w-]+(\.[\w-]+)*(\.[\w-]+|\.\*)(,~?[\w-]+(\.[\w-]+)*(\.[\w-]+|\.\*))*)?#\$#([^\s].*)/,
    /^(~?[\w-]+(\.[\w-]+)*(\.[\w-]+|\.\*)(,~?[\w-]+(\.[\w-]+)*(\.[\w-]+|\.\*))*)?#@\$#([^\s].*)/,
    /^(~?[\w-]+(\.[\w-]+)*(\.[\w-]+|\.\*)(,~?[\w-]+(\.[\w-]+)*(\.[\w-]+|\.\*))*)?#\$\?#([^\s].*)/,
    /^(~?[\w-]+(\.[\w-]+)*(\.[\w-]+|\.\*)(,~?[\w-]+(\.[\w-]+)*(\.[\w-]+|\.\*))*)?#@\$\?#([^\s].*)/,
  ];
  function findMatches(string, res) {
    let result = [-1, null];
    res.forEach((re, i) => {
      const match = string.match(re);
      if (match) result = [i, match];
    });
    return result;
  }
  function getEtag(header) {
    const result = findMatches(header, [
      /(e|E)tag: \"(\w+)\"/,
      // WebMonkey 系
      /(e|E)tag: \[\"(\w+)\"\]/,
      // 书签地球
      /(e|E)tag=\"(\w+)\"/,
    ]);
    return result[1] ? result[1][2] : null;
  }
  function makeRuleBox() {
    return {
      black: [],
      white: [],
    };
  }
  function domainChecker(domains) {
    const results = [],
      urlSuffix = /\.+?[\w-]+$/.exec(location.hostname);
    let mostMatch = {
      long: 0,
      result: false,
    };
    domains.forEach((domain) => {
      if (domain.endsWith(".*") && Array.isArray(urlSuffix)) {
        domain = domain.replace(".*", urlSuffix[0]);
      }
      const invert = domain[0] == "~";
      if (invert) domain = domain.slice(1);
      const result = location.hostname.endsWith(domain);
      results.push(result !== invert);
      if (result) {
        if (domain.length > mostMatch.long) {
          mostMatch = {
            long: domain.length,
            result: result !== invert,
          };
        }
      }
    });
    return mostMatch.long > 0 ? mostMatch.result : results.includes(true);
  }
  function hasSome(str, arr) {
    return arr.some((word) => str.includes(word));
  }
  function ruleSpliter(rule) {
    const result = findMatches(rule, ruleRE),
      group = result[1];
    if (group && (!group[1] || domainChecker(group[1].split(",")))) {
      const sel = group.pop();
      if (sel) {
        return {
          black: result[0] % 2 ? "white" : "black",
          type: Math.floor(result[0] / 2),
          sel,
        };
      }
    }
  }
  function ruleLoader(rule) {
    if (
      hasSome(rule, [
        ":matches-path(",
        ":min-text-length(",
        ":watch-attr(",
        ":-abp-properties(",
        ":matches-property(",
      ])
    )
      return;
    // 如果 #$# 不包含 {} 就排除
    // 可以尽量排除 Snippet Filters
    if (/(\w|^)#\$#/.test(rule) && !/{.+}/.test(rule)) return;
    // ## -> #?#
    if (
      /(\w|^)#@?#/.test(rule) &&
      hasSome(rule, [
        ":has(",
        ":-abp-has(",
        "[-ext-has=",
        ":has-text(",
        "contains(",
        "-abp-contains(",
        "[-ext-contains=",
        "matches-css(",
        "[-ext-matches-css=",
        "matches-css-before(",
        "[-ext-matches-css-before=",
        "matches-css-after(",
        "[-ext-matches-css-after=",
        "matches-attr(",
        "nth-ancestor(",
        "upward(",
        "xpath(",
        "remove()",
        "not(",
        "if-not(",
      ])
    ) {
      rule = rule.replace(/(\w|^)##/, "$1#?#").replace(/(\w|^)#@#/, "$1#@?#");
    }
    // :style(...) 转换
    // example.com#?##id:style(color: red)
    // example.com#$?##id { color: red }
    if (rule.includes(":style(")) {
      rule = rule
        .replace(/(\w|^)##/, "$1#$#")
        .replace(/(\w|^)#@#/, "$1#@$#")
        .replace(/(\w|^)#\?#/, "$1#$?#")
        .replace(/(\w|^)#@\?#/, "$1#@$?#")
        .replace(/:style\(/, " { ")
        .replace(/\)$/, " }");
    }
    return ruleSpliter(rule);
  }
  function storAutoClean() {
    const vars = [
        "ajs_disabled_domains",
        "ajs_saved_abprules",
        "ajs_rules_etags",
        "ajs_rules_ver",
      ],
      stor = vm.unsafeWindow.localStorage;
    vars.forEach((key) => {
      if (stor.getItem(key)) {
        stor.removeItem(key);
      }
    });
  }

  const selectors = makeRuleBox(),
    extSelectors = makeRuleBox(),
    styles = makeRuleBox(),
    extStyles = makeRuleBox(),
    values = {
      get black() {
        const arrStr = gmValue("get", false, "ajs_disabled_domains", "");
        return typeof arrStr == "string" && arrStr.length > 0
          ? arrStr.split(",")
          : [];
      },
      set black(v) {
        gmValue(
          "set",
          false,
          "ajs_disabled_domains",
          v === null || v === void 0 ? void 0 : v.join()
        );
      },
      get rules() {
        return gmValue("get", true, "ajs_saved_abprules", {});
      },
      set rules(v) {
        gmValue("set", true, "ajs_saved_abprules", v);
      },
      get css() {
        return gmValue("get", true, `ajs_saved_styles_${location.hostname}`, {
          needUpdate: true,
          hideCss: "",
          extraCss: "",
        });
      },
      set css(v) {
        gmValue("set", true, `ajs_saved_styles_${location.hostname}`, v);
      },
      get hasSave() {
        const arrStr = gmValue("get", false, "ajs_hasSave_domains", "");
        return typeof arrStr == "string" && arrStr.length > 0
          ? arrStr.split(",")
          : [];
      },
      set hasSave(v) {
        gmValue(
          "set",
          false,
          "ajs_hasSave_domains",
          v === null || v === void 0 ? void 0 : v.join()
        );
      },
      get time() {
        return gmValue("get", false, "ajs_rules_ver", "0/0/0 0:0:0");
      },
      set time(v) {
        gmValue("set", false, "ajs_rules_ver", v);
      },
      get etags() {
        return gmValue("get", true, "ajs_rules_etags", {});
      },
      set etags(v) {
        gmValue("set", true, "ajs_rules_etags", v);
      },
    },
    data = {
      disabled: false,
      saved: false,
      update: true,
      updating: false,
      receivedRules: "",
      allRules: "",
      presetCss:
        " {display: none !important;width: 0 !important;height: 0 !important;} ",
      hideCss: "",
      extraCss: "",
      appliedCount: 0,
      isFrame: vm.unsafeWindow.self !== vm.unsafeWindow.top,
      isClean: false,
      mutex: "__lemon__abp__parser__$__",
      timeout: 6000,
      xTimeout: 700,
    },
    menus = {
      disable: {
        id: undefined,
        get text() {
          return data.disabled ? "在此网站启用拦截" : "在此网站禁用拦截";
        },
      },
      update: {
        id: undefined,
        get text() {
          const time = values.time;
          return data.updating
            ? "正在更新..."
            : `点击更新: ${time.slice(0, 1) === "0" ? "未知时间" : time}`;
        },
      },
      count: {
        id: undefined,
        get text() {
          const cssCount = (data.hideCss + data.extraCss).match(/,/g);
          return data.isClean
            ? "已清空，点击刷新重新加载规则"
            : `${
                data.saved
                  ? "CSS: " +
                    (cssCount === null || cssCount === void 0
                      ? void 0
                      : cssCount.length)
                  : "规则: " +
                    data.appliedCount +
                    "/" +
                    data.allRules.split("\n").length
              }，点击清空规则`;
        },
      },
    };
  function gmMenu(name, cb) {
    if (
      typeof vm.GM_registerMenuCommand != "function" ||
      typeof vm.GM_unregisterMenuCommand != "function" ||
      data.isFrame
    )
      return;
    if (typeof menus[name].id != "undefined") {
      vm.GM_unregisterMenuCommand(menus[name].id);
      menus[name].id = undefined;
    }
    if (typeof cb == "function") {
      menus[name].id = vm.GM_registerMenuCommand(menus[name].text, cb);
    }
  }
  function gmValue(action, json, key, value) {
    switch (action) {
      case "get":
        let v;
        try {
          v = vm.GM_getValue(key, json ? JSON.stringify(value) : value);
        } catch (error) {
          return;
        }
        return json && typeof v == "string" ? JSON.parse(v) : v;
      case "set":
        try {
          value === null || value === undefined
            ? vm.GM_deleteValue(key)
            : vm.GM_setValue(key, json ? JSON.stringify(value) : value);
        } catch (error) {
          vm.GM_deleteValue(key);
        }
        break;
    }
  }
  function promiseXhr(details) {
    return __awaiter(this, void 0, void 0, function* () {
      let loaded = false;
      try {
        return yield new Promise((resolve, reject) => {
          vm.GM_xmlhttpRequest(
            Object.assign(
              {
                onload(e) {
                  loaded = true;
                  resolve(e);
                },
                onabort: reject.bind(null, "abort"),
                onerror(e) {
                  reject({
                    error: "error",
                    resp: e,
                  });
                },
                ontimeout: reject.bind(null, "timeout"),
                onreadystatechange(e) {
                  // X 浏览器超时中断
                  if (e.readyState === 4) {
                    setTimeout(() => {
                      if (!loaded)
                        reject({
                          error: "X timeout",
                          resp: e,
                        });
                    }, data.xTimeout);
                  }
                  // Via 浏览器超时中断，不给成功状态...
                  if (e.readyState === 3) {
                    setTimeout(() => {
                      if (!loaded)
                        reject({
                          error: "Via timeout",
                          resp: e,
                        });
                    }, data.timeout);
                  }
                },
                timeout: data.timeout,
              },
              details
            )
          );
        });
      } catch (error) {}
    });
  }
  function storeRule(rule, resp) {
    const savedRules = values.rules,
      savedEtags = values.etags;
    if (resp.responseHeaders) {
      const etag = getEtag(resp.responseHeaders);
      if (etag) {
        savedEtags[rule.标识] = etag;
        values.etags = savedEtags;
      }
    }
    if (resp.responseText) {
      if (rule.筛选后存储) {
        let parsed = "";
        resp.responseText.split("\n").forEach((rule) => {
          if (ruleRE.some((re) => re.test(rule))) parsed += rule + "\n";
        });
        savedRules[rule.标识] = parsed;
      } else {
        savedRules[rule.标识] = resp.responseText;
      }
      values.rules = savedRules;
      if (Object.keys(values.rules).length === 0) {
        data.receivedRules += "\n" + savedRules[rule.标识] + "\n";
      }
    }
  }
  function fetchRuleBody(rule) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      const getResp = yield promiseXhr({
        method: "GET",
        responseType: "text",
        url: rule.地址,
      });
      if (
        getResp &&
        (getResp === null || getResp === void 0
          ? void 0
          : getResp.responseText) &&
        ((_a = getResp.responseText) === null || _a === void 0
          ? void 0
          : _a.length) > 0
      ) {
        storeRule(rule, getResp);
        return true;
      } else return false;
    });
  }
  function fetchRule(rule) {
    return new Promise((resolve, reject) =>
      __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _e;
        const headResp = yield promiseXhr({
          method: "HEAD",
          responseType: "text",
          url: rule.地址,
        });
        if (!headResp) {
          reject("HEAD 失败");
        } else {
          const etag = getEtag(
              typeof headResp.responseHeaders == "string"
                ? headResp.responseHeaders
                : (_b = (_a = headResp).getAllResponseHeaders) === null ||
                  _b === void 0
                ? void 0
                : _b.call(_a)
            ),
            savedEtags = values.etags;
          if (
            (headResp === null || headResp === void 0
              ? void 0
              : headResp.responseText) &&
            ((_e = headResp.responseText) === null || _e === void 0
              ? void 0
              : _e.length) > 0
          ) {
            storeRule(rule, headResp);
            !etag || etag !== savedEtags[rule.标识]
              ? resolve()
              : reject("ETag 一致");
          } else {
            if (!etag || etag !== savedEtags[rule.标识]) {
              (yield fetchRuleBody(rule)) ? resolve() : reject("GET 失败");
            } else reject("ETag 一致");
          }
        }
      })
    );
  }
  function fetchRules(apply) {
    return __awaiter(this, void 0, void 0, function* () {
      const has = values.hasSave;
      let hasUpdate = onlineRules.length;
      data.updating = true;
      gmMenu("update", () => undefined);
      for (const rule of onlineRules) {
        if (rule.在线更新) {
          yield fetchRule(rule).catch((error) => {
            hasUpdate--;
          });
        }
      }
      values.time = new Date().toLocaleString("zh-CN");
      if (has.length > 0 && hasUpdate > 0) {
        has.forEach((host) => {
          const save = gmValue("get", true, `ajs_saved_styles_${host}`);
          save.needUpdate = true;
          gmValue("set", true, `ajs_saved_styles_${host}`, save);
        });
      }
      initRules(apply);
    });
  }
  function performUpdate(force, apply) {
    if (data.isFrame) Promise.reject();
    return force || new Date(values.time).getDate() !== new Date().getDate()
      ? fetchRules(apply)
      : Promise.resolve();
  }
  function switchDisabledStat() {
    const disaList = values.black;
    data.disabled = !disaList.includes(location.hostname);
    if (data.disabled) {
      disaList.push(location.hostname);
    } else {
      disaList.splice(disaList.indexOf(location.hostname), 1);
    }
    values.black = disaList;
    location.reload();
  }
  function makeInitMenu() {
    gmMenu("update", () =>
      __awaiter(this, void 0, void 0, function* () {
        yield performUpdate(true, false);
        location.reload();
      })
    );
    gmMenu("count", cleanRules);
  }
  function initRules(apply) {
    const abpRules = values.rules;
    if (typeof vm.GM_getResourceText == "function") {
      onlineRules.forEach((rule) => {
        let resRule;
        try {
          resRule = vm.GM_getResourceText(rule.标识);
        } catch (error) {
          resRule = "";
        }
        if (resRule && !abpRules[rule.标识]) abpRules[rule.标识] = resRule;
      });
    }
    const abpKeys = Object.keys(abpRules);
    abpKeys.forEach((name) => {
      data.receivedRules += "\n" + abpRules[name] + "\n";
    });
    data.allRules = defaultRules + data.receivedRules;
    data.updating = false;
    makeInitMenu();
    if (apply) splitRules();
    return data.receivedRules.length;
  }
  function styleApply() {
    if (data.hideCss.length > 0) {
      if (typeof vm.GM_addStyle == "function") {
        vm.GM_addStyle(data.hideCss);
      } else {
        const elem = document.createElement("style");
        elem.textContent = data.hideCss;
        document.documentElement.appendChild(elem);
      }
    }
    if (data.extraCss.length > 0) {
      new ExtendedCss({ styleSheet: data.extraCss }).apply();
    }
  }
  function cleanRules() {
    if (confirm(`是否清空存储规则 (${Object.keys(values.rules).length}) ?`)) {
      const has = values.hasSave;
      values.rules = {};
      values.time = "0/0/0 0:0:0";
      values.etags = {};
      if (has.length > 0) {
        has.forEach((host) => {
          gmValue("set", true, `ajs_saved_styles_${host}`);
        });
        values.hasSave = null;
      }
      data.appliedCount = 0;
      data.allRules = "";
      data.isClean = true;
      gmMenu("update");
      gmMenu("count", () => location.reload());
    }
  }
  function parseRules() {
    const boxes = ["hideCss", "extraCss"];
    data.hideCss = "";
    data.extraCss = "";
    [styles, extStyles].forEach((r, t) => {
      r.black
        .filter((v) => !r.white.includes(v))
        .forEach((s, i, a) => {
          data[boxes[t]] += `${s} `;
          if (i == 0) data.appliedCount += a.length;
        });
    });
    [selectors, extSelectors].forEach((r, t) => {
      r.black
        .filter((v) => !r.white.includes(v))
        .forEach((s, i, a) => {
          data[boxes[t]] += `${i == 0 ? "" : ","}${s}`;
          if (i == a.length - 1) {
            data[boxes[t]] += data.presetCss;
            data.appliedCount += a.length;
          }
        });
    });
    gmMenu("count", cleanRules);
    saveCss();
    if (!data.saved) styleApply();
  }
  function splitRules() {
    data.allRules.split("\n").forEach((rule) => {
      const ruleObj = ruleLoader(rule),
        boxes = [selectors, extSelectors, styles, extStyles];
      if (typeof ruleObj != "undefined") {
        if (
          ruleObj.black == "black" &&
          boxes[ruleObj.type].white.includes(ruleObj.sel)
        )
          return;
        boxes[ruleObj.type][ruleObj.black].push(ruleObj.sel);
      }
    });
    parseRules();
  }
  function saveCss() {
    const styles = {
        needUpdate: false,
        hideCss: data.hideCss,
        extraCss: data.extraCss,
      },
      has = values.hasSave;
    values.css = styles;
    if (!has.includes(location.hostname)) has.push(location.hostname);
    values.hasSave = has;
  }
  function readCss() {
    var _a;
    const styles = values.css;
    if (styles.hideCss.length > 0) {
      data.saved = true;
      data.update =
        (_a = styles.needUpdate) !== null && _a !== void 0 ? _a : true;
      data.hideCss = styles.hideCss;
      data.extraCss = styles.extraCss;
      return true;
    } else return false;
  }
  function main() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      if (
        ((_b =
          (_a = vm.unsafeWindow.mbrowser) === null || _a === void 0
            ? void 0
            : _a.getVersionCode) === null || _b === void 0
          ? void 0
          : _b.call(_a)) >= 662
      )
        storAutoClean();
      data.disabled = values.black.includes(location.hostname);
      gmMenu("disable", switchDisabledStat);
      if (data.disabled) return;
      readCss();
      saved: {
        if (data.saved) {
          styleApply();
          makeInitMenu();
          if (!data.update) break saved;
        }
        if (initRules(false) === 0) yield performUpdate(true, true);
        splitRules();
      }
      yield performUpdate(false, false);
    });
  }
  function runOnce(key, func) {
    if (key in vm.unsafeWindow) return;
    vm.unsafeWindow[key] = true;
    func();
  }
  runOnce(data.mutex, main);
})(
  {
    unsafeWindow: typeof unsafeWindow == "object" ? unsafeWindow : window,
    GM_registerMenuCommand:
      typeof GM_registerMenuCommand == "function"
        ? GM_registerMenuCommand
        : undefined,
    GM_unregisterMenuCommand:
      typeof GM_unregisterMenuCommand == "function"
        ? GM_unregisterMenuCommand
        : undefined,
    GM_getValue: typeof GM_getValue == "function" ? GM_getValue : undefined,
    GM_deleteValue:
      typeof GM_deleteValue == "function" ? GM_deleteValue : undefined,
    GM_setValue: typeof GM_setValue == "function" ? GM_setValue : undefined,
    GM_xmlhttpRequest:
      typeof GM_xmlhttpRequest == "function" ? GM_xmlhttpRequest : undefined,
    GM_getResourceText:
      typeof GM_getResourceText == "function" ? GM_getResourceText : undefined,
    GM_addStyle: typeof GM_addStyle == "function" ? GM_addStyle : undefined,
  },
  ExtendedCss
);
