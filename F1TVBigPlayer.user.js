// ==UserScript==
// @name         F1TV Big Player
// @namespace    http://tampermonkey.net/
// @version      0.9
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
    }

    function MakeDefaultWidth () {
        var player = document.querySelector('.inset-video-item-image-container');
        player.removeAttribute("style");
        var cntnr = document.body;
        cntnr.style.overflowY = "auto";
    }

    window.MakeFullWidth = MakeFullWidth;
    window.MakeDefaultWidth = MakeDefaultWidth;
  
})();
