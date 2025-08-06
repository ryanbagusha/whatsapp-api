require('dotenv').config();

const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { getCuacaAccu, getCuacaBmkg } = require('./cuaca');
const express = require('express');

const fToC = f => ((f - 32) * 5 / 9).toFixed(1);

const whatsapp = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox']
    }
});
const app = express();
const PORT = 3000;
const API_KEY_FORECAST = process.env.API_KEY_FORECAST;

whatsapp.on('qr', qr => {
    qrcode.generate(qr, {
        small: true
    });
});

whatsapp.on('ready', () => {
    console.log('Client is ready!');
});

whatsapp.on('message', async message => {
    if (message.body === '!ping') {
        message.reply('pong');
    }

    if (message.body.toLowerCase() === 'cuaca') {
        try {
            const cuaca = await getCuacaAccu(209036); // Banjarmasin
            await message.reply(cuaca);
        } catch (error) {
            console.error('Gagal ambil data cuaca:', error.message);
            await message.reply('Maaf, gagal mengambil data cuaca saat ini.');
        }
    }

    if (message.body.toLowerCase() === 'jadwal sholat') {
        try {
            const tanggal = new Date().toISOString().split('T')[0];
            const kode_kota = '2113'; // Banjarmasin
            const response = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/${kode_kota}/${tanggal}`);

            const data = response.data.data;
            const sekarang = new Date(Date.now());
            const tanggalFormatted = new Intl.DateTimeFormat('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(sekarang);

            const pesan = `
🕌 *Jadwal Sholat - ${data.lokasi}*\n📍 *${data.daerah}*\n📅 *${tanggalFormatted}*\n
- 🕓 *Imsak*     : ${data.jadwal.imsak}
- 🌄 *Subuh*     : ${data.jadwal.subuh}
- 🌅 *Terbit*    : ${data.jadwal.terbit}
- ☀️ *Dhuha*     : ${data.jadwal.dhuha}
- 🕛 *Dzuhur*    : ${data.jadwal.dzuhur}
- 🕒 *Ashar*     : ${data.jadwal.ashar}
- 🌇 *Maghrib*   : ${data.jadwal.maghrib}
- 🌙 *Isya*      : ${data.jadwal.isya}
`.trim();

            await message.reply(pesan);
        } catch (error) {
            console.error('Gagal ambil data jadwal sholat:', error.message);
            await message.reply('Maaf, gagal mengambil data jadwal sholat saat ini.');
        }
    }

    if (message.body.toLowerCase().startsWith('cuaca ')) {
        const wilayah = message.body.split(' ')[1];
        const validWilayah = {
            'pelaihari': '63.01.03.1004',
            'belitung': '63.71.03.1001',
            'bumi mas': '63.71.01.1011'
        };
        if (!validWilayah[wilayah.toLowerCase()]) {
            return message.reply('Wilayah tidak dikenali. Silakan coba dengan "cuaca pelaihari", "cuaca belitung", atau "cuaca bumi mas".');
        }
        const kode_wilayah = validWilayah[wilayah.toLowerCase()];

        try {
            const cuaca = await getCuacaBmkg(kode_wilayah);
            await message.reply(cuaca);
        } catch (error) {
            console.error('Gagal ambil data cuaca:', error.message);
            await message.reply('Maaf, gagal mengambil data cuaca saat ini.');
        }
    }

    message.reply(`Pesan anda tidak dikenali. Silakan coba dengan "cuaca" atau "jadwal sholat".`);
});

whatsapp.initialize();

app.get('/send', async (req, res) => {
    const { to, message } = req.query;

    if (!to || !message) {
        return res.status(400).send('Missing "to" or "message" query param');
    }

    try {
        await whatsapp.sendMessage(to + '@c.us', message);
        res.send(`✅ Message sent to ${to}`);
    } catch (error) {
        console.error('❌ Error sending message:', error);
        res.status(500).send('Failed to send message');
    }
});

app.get('/list-groups', async (req, res) => {
    const chats = await whatsapp.getChats();
    const groups = chats.filter(chat => chat.isGroup);

    const groupList = groups.map(group => ({
        id: group.id._serialized,
        name: group.name
    }));

    res.json(groupList);
});

app.get('/send-group', async (req, res) => {
    const { groupName, message } = req.query;

    if (!groupName || !message) {
        return res.status(400).send('Missing "groupName" or "message"');
    }

    try {
        const chats = await whatsapp.getChats();
        const group = chats.find(chat => chat.isGroup && chat.name.toLowerCase() === groupName.toLowerCase());

        if (!group) {
            return res.status(404).send('Group not found');
        }

        await whatsapp.sendMessage(group.id._serialized, message);
        res.send(`✅ Message sent to group "${group.name}"`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to send message to group');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
