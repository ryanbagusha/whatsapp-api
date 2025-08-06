const axios = require('axios');

async function getCuacaAccu(kode_kota) {
    const apiKey = API_KEY_FORECAST;
    // const kode_kota = '209036'; // Banjarmasin
    const response = await axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${kode_kota}`, {
        params: {
            apikey: apiKey,
            language: 'id-id'
        }
    });

    const forecast = response.data;
    const sekarang = new Date(Date.now());
    const tanggalFormatted = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(sekarang);

    const cuacaText = `
⚠️ *Peringatan Cuaca*:
${forecast.Headline.Text}
Berlaku dari ${new Date(forecast.Headline.EffectiveDate).toLocaleString("id-ID")} sampai ${new Date(forecast.Headline.EndDate).toLocaleString("id-ID")}

📅 *Prakiraan Cuaca ${tanggalFormatted}*:
🌡️ Suhu: Minimum ${fToC(forecast.DailyForecasts[0].Temperature.Minimum.Value)}°C, Maksimum ${fToC(forecast.DailyForecasts[0].Temperature.Maximum.Value)}°C

☀️ *Siang*:
${forecast.DailyForecasts[0].Day.IconPhrase}
Hujan: ${forecast.DailyForecasts[0].Day.HasPrecipitation ? forecast.DailyForecasts[0].Day.PrecipitationType + ", intensitas " + forecast.DailyForecasts[0].Day.PrecipitationIntensity : "Tidak ada"}

🌙 *Malam*:
${forecast.DailyForecasts[0].Night.IconPhrase}
Hujan: ${forecast.DailyForecasts[0].Night.HasPrecipitation ? forecast.DailyForecasts[0].Night.PrecipitationType + ", intensitas " + forecast.DailyForecasts[0].Night.PrecipitationIntensity : "Tidak ada"}

🔗 Info lengkap: ${forecast.Headline.Link}
                `.trim();

    return cuacaText;
}

async function getCuacaBmkg(kode_wilayah) {
    const response = await axios.get(`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${kode_wilayah}`);

    const forecast = response.data;
    const lokasi = forecast.lokasi;
    const dataCuaca = forecast.data[0].cuaca[0]; // Ambil hari pertama
    const tanggal = new Date(dataCuaca[0].local_datetime).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    let pesan = `🌤️ *Prakiraan Cuaca ${tanggal}*\n📍 *${lokasi.desa}, ${lokasi.kecamatan} - ${lokasi.kotkab}*\n\n`;

    dataCuaca.forEach(item => {
        const jam = new Date(item.local_datetime).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });

        pesan += `🕓 *${jam}* WIB\n`;
        pesan += `☁️ Cuaca: ${item.weather_desc}\n`;
        pesan += `🌡️ Suhu: ${item.t}°C\n`;
        pesan += `💧 Kelembaban: ${item.hu}%\n`;
        pesan += `💨 Angin: ${item.wd} ${item.ws} km/jam\n`;
        pesan += `👁️ Jarak Pandang: ${item.vs_text}\n\n`;
    });

    return pesan.trim();
}

module.exports = { getCuacaAccu, getCuacaBmkg };