// CONFIG
var BOT_TOKEN = "YOUR_BOT_TOKEN"; // Ganti dengan TOKEN BOT Anda
var USERS = [YOUR_CHAT_ID]; // Ganti dengan CHAT ID yang diizinkan, bisa lebih dari 1

function doGet(e) {
  return HtmlService.createHtmlOutput('<h1>OK</h1>');
}

function doPost(e) {
  if (e.postData.type == "application/json") {
    let update = JSON.parse(e.postData.contents);
    if (update) {
      handleCommands(update);
      return true;
    }
  }
}

function handleCommands(update) {
  let chatId = update.message.chat.id;
  let first_name = update.message.chat.first_name;
  let text = update.message.text || '';

  if (USERS.includes(chatId)) {
    // Tambahkan logika untuk menangani perintah di sini

    if (text.startsWith("/start")) {
      sendMessage({
        chat_id: chatId,
        text: `🙋🏽 Halo, ${first_name}!\n\n` +
              `buatan @lifgardika.\n\n` +
              `Selamat datang di Bot Anda! Silakan gunakan perintah yang tersedia untuk melanjutkan.`
      });
    } 
  
    
    else {
      sendMessage({
        chat_id: chatId,
        text: "❓ Perintah tidak dikenal. Silakan gunakan /start untuk melihat perintah yang tersedia."
      });
    }
  } else {
    sendMessage({
      chat_id: chatId,
      text: "🚫 Anda tidak memiliki akses untuk menggunakan bot ini."
    });
  }
}

function sendMessage(postdata) {
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(postdata),
    'muteHttpExceptions': true
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', options);
}
