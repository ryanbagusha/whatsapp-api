const axios = require('axios');

async function getJadwalSholat(kode_kota) {
    const tanggal = new Date().toISOString().split('T')[0];
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

    return pesan;
}

module.exports = { getJadwalSholat };
