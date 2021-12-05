// ==UserScript==
// @name         F1TV Big Player
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make F1TV Player Big
// @author       Jason C
// @include      /^https?://f1tv.formula1.com/.*[?&]action=play.*/
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

    var ButtonSVG = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><rect x='3' y='5' width='18' height='14' stroke-width='2' stroke='#d0d0d2' fill='none'/></svg>";

    function MakeFullWidth () {
        var player = document.querySelector('.inset-video-item-image-container');
        player.style.setProperty("position", "fixed", "important");
        player.style.top = "0";
        player.style.left = "0";
        player.style.bottom = "0";
        player.style.right = "0";
        player.style.zIndex = 1000;
        var cntnr = document.body;
        cntnr.style.overflowY = "hidden";
        document.getElementById("fbpbutton").onclick = MakeDefaultWidth;
    }

    function MakeDefaultWidth () {
        var player = document.querySelector(".inset-video-item-image-container");
        player.removeAttribute("style");
        var cntnr = document.body;
        cntnr.style.overflowY = "auto";
        document.getElementById("fbpbutton").onclick = MakeFullWidth;
    }

    function AddPlayerButton () {
        if (!document.getElementById("fbpbutton")) {
            var sibling = document.querySelector(".bmpui-ui-fullscreentogglebutton");
            if (!sibling) { return false; }
            var button = document.createElement("button");
            button.id = "fbpbutton";
            button.type = "button";
            button.setAttribute("class", "bmpui-ui-button bmpui-off");
            button.ariaLabel = "Maximize";
            button.ariaPressed = "false";
            button.tabIndex = "0";
            button.setAttribute("role", "button");
            button.innerHTML = '<span class="bmpui-label">Maximize</span>';
            button.setAttribute("style", `background-image:url("data:image/svg+xml,${encodeURIComponent(ButtonSVG)}")`);
            button.onclick = MakeFullWidth;
            sibling.parentNode.appendChild(button);
        }
        return true;
    }

    window.MakeFullWidth = MakeFullWidth;
    window.MakeDefaultWidth = MakeDefaultWidth;
    window.AddPlayerButton = AddPlayerButton;

    let initInt = setInterval(function() { AddPlayerButton() && clearInterval(initInt); }, 500);

})();
