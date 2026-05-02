const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { statusBedrock } = require('minecraft-server-util');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const SERVER_IP = process.env.SERVER_IP;
const SERVER_PORT = Number(process.env.SERVER_PORT || 19132);

let lastMessage = null;
let isOnline = null; // track previous state

client.once('ready', async () => {
  const channel = await client.channels.fetch(CHANNEL_ID);

  const embed = new EmbedBuilder()
    .setTitle("<:fc952:1499385248616550500> Gustaivium SMP")
    .setDescription("Checking server status...")
    .setColor(0x3498db);

  lastMessage = await channel.send({ embeds: [embed] });

  setInterval(async () => {
    let currentOnline = false;
    let playerText = "Unknown";

    try {
      const res = await statusBedrock(SERVER_IP, SERVER_PORT);
      currentOnline = true;
      playerText = `${res.players.online}/${res.players.max}`;
    } catch (err) {
      currentOnline = false;
    }

    // detect state change
    const stateChanged = isOnline !== currentOnline;
    isOnline = currentOnline;

    const statusEmoji = currentOnline
      ? "<:earth:1496851758482329661> ***Server Status*** <a:animatedarrowbluelite:1483285267602473081> 🟢"
      : "<:earth:1496851758482329661> ***Server Status*** <a:animatedarrowbluelite:1483285267602473081> 🔴";

    const playerLine = `<:fc14:1499366880878526474> ***Player Count*** <a:animatedarrowbluelite:1483285267602473081>\n**${playerText}**`;

    let uptimeLine = "";

    if (currentOnline) {
      uptimeLine = "*Online for the past period*";
    } else {
      uptimeLine = "*Offline for the past period*";
    }

    const embed = new EmbedBuilder()
      .setTitle("<:fc952:1499385248616550500> Gustavium SMP")
      .setDescription(`${statusEmoji}\n\n${playerLine}\n\n${uptimeLine}`)
      .setColor(0x3498db);

    await lastMessage.edit({ embeds: [embed] });

  }, 10000);
});

client.login(TOKEN);
