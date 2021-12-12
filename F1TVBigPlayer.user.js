// ==UserScript==
// @name         F1TV Big Player
// @namespace    http://tampermonkey.net/
// @version      1.2.0-rc.1
// @description  Make F1TV Player Big
// @author       Jason C
// @include      /^https?://f1tv.formula1.com/.*/
// @icon         https://www.google.com/s2/favicons?domain=formula1.com
// @grant        none
// @updateURL    https://github.com/JC3/F1TVBigPlayer/raw/main/F1TVBigPlayer.user.js
// @downloadURL  https://github.com/JC3/F1TVBigPlayer/raw/main/F1TVBigPlayer.user.js
// ==/UserScript==
/*
 * F1TVBigPlayer is free and unencumbered software released into the public domain.
 * For more information, please refer to <https://unlicense.org>.
 * Not authorized by or affiliated with F1TV.
*/

(function() {
    'use strict';

    let MaxButtonSVG = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke-width='2'><rect x='7' y='9' width='10' height='6' stroke='#808080'/><rect x='3' y='5' width='18' height='14' stroke='#d0d0d2'/></svg>";
    let DefButtonSVG = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke-width='2'><rect x='7' y='9' width='10' height='6' stroke='#d0d0d2'/><rect x='3' y='5' width='18' height='14' stroke='#808080'/></svg>";
    let adding = false;
    let observer = null;

    let css = document.createElement("style");
    css.innerText =
        "body.fbpmaximized .inset-video-item-image-container {" +
        "  position: fixed !important;" +
        "  top: 0;" +
        "  left: 0;" +
        "  bottom: 0;" +
        "  right: 0;" +
        "  z-index: 1000;" +
        "}" +
        "body.fbpmaximized {" +
        "  overflow-y: hidden;" +
        "  overflow-x: hidden;" +
        "}" +
        "body.fbpmaximized .fbpbutton {" +
        `  background-image:url("data:image/svg+xml,${encodeURIComponent(DefButtonSVG)}");` +
        "}" +
        ".fbpbutton {" +
        `  background-image:url("data:image/svg+xml,${encodeURIComponent(MaxButtonSVG)}");` +
        "}";
    document.head.appendChild(css);

    // there are multiple control bars, need to modify all of them.
    function AddPlayerButtons () {
        document.querySelectorAll(".bmpui-ui-fullscreentogglebutton")
            .forEach((e) => AddPlayerButton(e.parentNode));
    }

    function AddPlayerButton (controls) {
        if (!controls.classList.contains("fbpmodified")) {
            let button = document.createElement("button");
            button.type = "button";
            button.setAttribute("class", "bmpui-ui-button bmpui-off fbpbutton");
            button.ariaLabel = "Maximize";
            button.ariaPressed = "false";
            button.tabIndex = "0";
            button.setAttribute("role", "button");
            button.innerHTML = '<span class="bmpui-label">Big Mode</span>';
            button.onclick = () => document.body.classList.toggle("fbpmaximized");
            try {
                adding = true;
                controls.appendChild(button);
                controls.classList.add("fbpmodified");
            } finally {
                adding = false;
            }
            console.log("F1TVBigPlayer: Added button to a control bar.");
        }
    }

    // button must be added/removed on dom changes rather than on load because
    // for some navigation paths (like search -> play) the f1tv site rebuilds
    // the div#app rather than loading a new page. this is also why this script
    // needs to @include the whole site: we never know where we've started.
    function InitPlayerMonitor () {
        if (!observer) {
            let app = document.querySelector("div#app");
            if (!app) { return false; }
            (observer = new MutationObserver(function(muts) {
                if (!adding) {
                    let nodesAdded = false, nodesRemoved = false;
                    for (let mut of muts) {
                        nodesAdded = nodesAdded || mut.addedNodes.length > 0;
                        nodesRemoved = nodesRemoved || mut.removedNodes.length > 0;
                        if (nodesAdded && nodesRemoved) { break; }
                    }
                    if (nodesAdded) {
                        AddPlayerButtons(); }
                    if (nodesRemoved && !document.querySelector(".fbpbutton")) {
                        document.body.classList.remove("fbpmaximized"); }
                }
            })).observe(app, { subtree: true, childList: true });
        }
        return true;
    }

    window.FBP = {
        MakeFullWidth: () => document.body.classList.add("fbpmaximized"),
        MakeDefaultWidth: () => document.body.classList.remove("fbpmaximized"),
        ToggleWidth: () => document.body.classList.toggle("fbpmaximized"),
        AddPlayerButtons: AddPlayerButtons,
        InitPlayerMonitor: InitPlayerMonitor
    }

    let initInt = setInterval(function() { InitPlayerMonitor() && clearInterval(initInt); }, 500);

})();
