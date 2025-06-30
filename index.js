const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.TELEGRAM_TOKEN;
const GAS_WEBHOOK_URL = process.env.GAS_WEBHOOK_URL;

const bot = new TelegramBot(token, { polling: true });

async function sendToSheet(text) {
  try {
    const encodedText = encodeURIComponent(text);
    const url = `${GAS_WEBHOOK_URL}?text=${encodedText}`;
    const response = await axios.get(url);
    if (response.data.status === 'ok') {
      return 'Data berhasil disimpan ke Google Sheets.';
    } else {
      return `Gagal menyimpan data: ${response.data.message}`;
    }
  } catch (error) {
    return `Error pada pengiriman ke webhook: ${error.message}`;
  }
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || !text.includes(',')) {
    bot.sendMessage(chatId, 'Format pesan salah. Harus seperti ini: kategori,jumlah,deskripsi');
    return;
  }

  const resultMsg = await sendToSheet(text);
  bot.sendMessage(chatId, resultMsg);
});
