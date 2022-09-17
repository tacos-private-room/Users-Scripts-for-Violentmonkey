// ==UserScript==
// @name:ko           글로벌 다크모드
// @name              Global Darkmode
// @name:ru           Глобальный темный режим
// @name:jp           グローバルダークモード
// @name:zh-TW        全局暗模式
// @name:zh-CN        全局暗模式

// @description:ko    밝은 색의 웹 사이트들만 어둡게 만듭니다.
// @description       Turn only bright websites to dark.
// @description:ru    Делайте темными только яркие сайты.
// @description:jp    明るいウェブサイトだけを暗くします。
// @description:zh-TW 它只會將明亮的網站變為黑暗。
// @description:zh-CN 它只会将明亮的网站变为黑暗。

// @namespace         https://ndaesik.tistory.com/
// @version           2022.04.18.22:04
// @author            ndaesik
// @icon              data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><text x="-19vh" y="84vh" font-size="100vh">🪐</text></svg>
// @match             *://*/*

// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM_registerMenuCommand
// @run-at            document-start
// ==/UserScript==
let PRE = document.createElement("style")
PRE.innerText = `* {background:#202124!important; border-color:#3c4043!important; color-scheme:dark!important; color:#bdc1c6!important}`
PRE.classList.add("PRE")
self == top && document.head?.appendChild(PRE)

window.addEventListener("load", function(){
(async () => {
(await GM.getValue("OnURL") == undefined) ? GM.setValue("OnURL", "") : null;
(await GM.getValue("OfURL") == undefined) ? GM.setValue("OfURL", "") : null;
let OnURL = await GM.getValue("OnURL"),
    OfURL = await GM.getValue("OfURL"),
    BLrun = OnURL == "" || OnURL.replaceAll(/\s/g,"").split(/[\r\n]+|,/g).filter(w => window.document.URL.indexOf(w) > -1).length == 0,
    WLrun = OfURL != "" && OfURL.replaceAll(/\s/g,"").split(/[\r\n]+|,/g).filter(m => window.document.URL.indexOf(m) > -1).length != 0,
    Lturn = () => {
        let e = document.querySelector("#GDM_option");
        (e.style.display == "none")
            ? e.style.display = "block"
            : (e.style.display = "none", GM.setValue("OnURL", document.querySelector("#GDM_On_filter").value), GM.setValue("OfURL", document.querySelector("#GDM_Off_filter").value))
    }
document.body.insertAdjacentHTML("beforeend", `
<div id="GDM_option" style="display: none">
    <input id="GDM_Off" type="radio" name="contact"><label for="GDM_Off">On</label>
    <input id="GDM_On"  type="radio" name="contact"><label for="GDM_On">Off</label>
    <input id="GDM_Abt" type="radio" name="contact" checked="checked"><label class="GDM_label GDM_button" for="GDM_Abt">About</label>
    <a id="GDM_save" class="GDM_button">❌</a>
    <div id="GDM_content">
        <textarea id="GDM_Off_filter" spellcheck="false" placeholder="example.com,\nlotemipsum.com">`+OfURL+`</textarea>
        <textarea id="GDM_On_filter" spellcheck="false" placeholder="example.com,\nlotemipsum.com">`+OnURL+`</textarea>
        <div id="GDM_about" style="display: none">On tab for set the site that always applies this theme.
Off tab for set the site to which the theme is not applied.
The filter list is separated by commas and line breaks.
            <div class="GDM_about_inner GDM_about_inner_btm" style="position:absolute; bottom:5px">
                <a href="https://greasyfork.org/scripts/434440/feedback">Suggestion & Bug Report</a></br>
                <a href="https://paypal.me/ndaesik">Devs paypal.me</a>
            </div>
        </div>
    </div>
</div>

<style>
#GDM_option * {all:initial}
#GDM_option {background-color: #6A6C6E!important; position: fixed; top: 25px; right: 25px; width: 375px; z-index: 2147483647; box-shadow: 0 0 0 1px hsl(0,0%,17.5%); user-select: none}
#GDM_option [type="radio"] {visibility:hidden; width: 0}
#GDM_option [type="radio"]:checked+label {font-weight:bold; background-color: #FFF!important}
#GDM_option label {height:25px; width:90px; background-color: #6A6C6E; text-align: center; display: inline-block; width: 100px; user-select: none; text-align: center!important}
#GDM_option label:hover {background-color: #FFF!important}
#GDM_option #GDM_save {position: absolute; right: 0; user-select: none; text-decoration: none!important}
#GDM_content>div {white-space : pre-line}
#GDM_content>*{background-color: #FFF!important; min-height: 250px; padding: 5px 8px; font-size: 14px; display: none; width: 359px}
#GDM_On:checked~#GDM_content #GDM_On_filter,
#GDM_Off:checked~#GDM_content #GDM_Off_filter {display: block}
#GDM_Abt:checked~#GDM_content #GDM_about {display: inline-block!important}
#GDM_option a:hover {cursor: pointer; text-decoration:underline}
</style>
`)
document.querySelector("#GDM_save").addEventListener("click", () => Lturn())

let bdyH0 = window.parent.document.body.offsetHeight == 0,
    frame = self != top,
    elems = document.querySelectorAll("body > :not(script)"),
    apply = () => document.head.appendChild(drkMo),
    togle = () => (document.querySelector(".drkMo") == null) ? apply() : document.querySelector(".drkMo").remove(),
    drkMo = document.createElement("style"),
    check = (m,m2=0) => {
    let n = (n) => {return parseInt(getComputedStyle(document.querySelectorAll(m)[m2]).getPropertyValue("background-color").match(/\d+/g)[n])};
    return (n(0)*0.299+n(1)*0.587+n(2)*0.114) > 186 || n(3) == 0 }
drkMo.innerText = `
html {color-scheme:dark!important;color:#000}
html * {color-scheme:light!important;text-shadow:0 0 .1px}
html body {background:none!important}
html, html :is(i, img, image, embed, video, canvas, option, object, :fullscreen:not(iframe), iframe:not(:fullscreen)),
html body>* [style*="url("]:not([style*="cursor:"]):not([type="text"]) {filter:invert(1)hue-rotate(180deg)!important}
html body>* [style*="url("]:not([style*="cursor:"]) :not(#⁠),
html:not(#⁠) :is(canvas, option, object) :is(i, img, image, embed, video),
html:not(#⁠) video:fullscreen{filter:unset!important}`
drkMo.classList.add("drkMo")
document.querySelector(".PRE")?.remove()
if(WLrun) {apply()} else
    if(BLrun) {
        if((!frame && !bdyH0 || frame) && check("html") && check("body")) apply()
        if(!frame && bdyH0) {for (let i = 0; i < elems.length ; i++) {if (elems[i].scrollHeight > window.innerHeight && check("body > :not(script)",i)) apply()}}
    }
GM_registerMenuCommand("On/Off", togle)
GM_registerMenuCommand("Filter", Lturn)
})()});