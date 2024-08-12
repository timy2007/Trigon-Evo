// ==UserScript==
// @name         Bloxflip Rain Notifier
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Notify about rain !
// @author       Valentineuh
// @match        https://bloxflip.com/*
// @icon         https://bloxflip.com/favicon.ico
// @license      MIT
// @grant        GM_xmlhttpRequest
// ==/UserScript==

window.addEventListener('load', () => {

    let raining = false;

    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    setInterval(async () => {
        let data = await (await fetch('https://api.bloxflip.com/chat/history')).json();
        let prize = data.rain.prize
        if (data.rain.active && !raining) {
            if (Notification.permission === 'granted') {
                new Notification("Rain detected! 😋", {
                    body: `Rain has started yeppie!! Prize : ${prize} bobux.`,
                    icon: 'https://raw.githubusercontent.com/valxe/bloxflip-rain-joiner/main/icone.png'
                });
            }
            raining = true;

        } else if (!data.rain.active && raining) {
            raining = false;
        }
    }, 5000);
});
