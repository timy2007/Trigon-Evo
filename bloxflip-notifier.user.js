// ==UserScript==
// @name         Bloxflip Rain Notifier with Webhook
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Notify about rain and send to Discord Webhook!
// @author       Valentineuh
// @match        https://bloxflip.com/*
// @icon         https://bloxflip.com/favicon.ico
// @license      MIT
// @grant        GM_xmlhttpRequest
// ==/UserScript==

let raining = false;
let testMode = false;
const WEBHOOK_URL = "https://discord.com/api/webhooks/1278496948403572767/DPrvuwq1nQ_F7--AeMegsjbddoucn4acAOuAORmePCtD1uLfl0z_oZyjbOUdwewPDS7s";

if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

setTimeout(() => {
    setInterval(async () => {
        let data;

        if (testMode) {
            data = {
                rain: {
                    active: true,
                    prize: 150000,
                    created: Date.now(),
                    duration: 300000,
                    players: ["Black Bear", "Bee Bear", "Onett"],
                    host: "BeeSwarmOnTop"
                }
            };
        } else {
            data = await (await fetch('https://api.bloxflip.com/chat/history')).json();
        }

        let prize = data.rain.prize;
        let host = data.rain.host;
        let createdTime = new Date(data.rain.created);
        let duration = data.rain.duration;
        let endTime = new Date(createdTime.getTime() + duration);
        let discordEndTime = `<t:${Math.floor(endTime.getTime() / 1000)}:R>`;

        if (data.rain.active && !raining) {
            raining = true;

            if (Notification.permission === 'granted') {
                new Notification("Rain detected! 😋", {
                    body: `Rain has started! Prize: ${prize}$ bobux. Host: ${host}`,
                    icon: "https://raw.githubusercontent.com/valxe/bloxflip-rain-joiner/main/icone.png"
                });
            }

            sendToWebhook({
                title: "Rain detected! 😋",
                description: `Rain has started!\nPrize: **${prize}$ bobux**.\nHost: **${host}**\nEnds: **${discordEndTime}**`,
                color: 7618473,
                thumbnail: { url: "https://raw.githubusercontent.com/RadianeData/radianedata/main/assets/45497981.png" },
                footer: {
                    text: "Bloxflip Rain Notifier",
                    icon_url: "https://raw.githubusercontent.com/valxe/bloxflip-rain-joiner/main/icone.png"
                }
            });

        } else if (!data.rain.active && raining) {
            raining = false;
        }
    }, 10000);
}, 5000);

function sendToWebhook(embed) {
    GM_xmlhttpRequest({
        method: "POST",
        url: WEBHOOK_URL,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ embeds: [embed] }),
        onload: function (response) {
            if (response.status === 204) {
                console.log("Embed sent to Discord webhook successfully!");
            } else {
                console.error("Failed to send embed to Discord webhook:", response.status, response.statusText);
            }
        }
    });
}
