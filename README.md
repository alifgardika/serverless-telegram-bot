# Serverless Telegram Bot using Google Apps Script

This repository contains scripts for creating a serverless Telegram bot using Google Apps Script. The bot responds to the `/start` command and can be configured to restrict access to certain users. 

**Buatan Alif**

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [1. Create a Telegram Bot](#1-create-a-telegram-bot)
  - [2. Deploy Google Apps Script](#2-deploy-google-apps-script)
  - [3. Set Up Webhook](#3-set-up-webhook)
- [Customizing the Bot](#customizing-the-bot)
- [License](#license)

## Features

- Responds to the `/start` command.
- Allows only authorized users to interact with the bot.
- Configurable via Google Apps Script.

## Prerequisites

- A Telegram account to create a bot.
- Access to Google Apps Script via your Google account.

## Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for **[BotFather](https://t.me/botfather)**.
2. Start a chat with BotFather by clicking the **Start** button or sending `/start`.
3. Create a new bot by sending the command `/newbot`.
4. Follow the instructions provided by BotFather:
   - **Choose a name** for your bot (this can be anything).
   - **Choose a username** for your bot. The username must be unique and must end with `bot` (e.g., `myawesomebot`).
5. After successfully creating the bot, BotFather will send you a message with the **bot token**:

   Save this **bot token** as it will be needed for making API requests.

---

## 2. Get Your Chat ID

### Option 1: Using a Web Browser

1. Open the following URL in your web browser, replacing `YOUR_BOT_TOKEN` with the token you got from BotFather:
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
2. Send a message to your bot from your personal Telegram account or a group where the bot is added.
3. Refresh the URL, and you will see a JSON response. Find the section that looks like this:
   ```json
   "chat": {
     "id": 123456789,
     "first_name": "YourName",
     "username": "yourusername"
   }
   ```
4. The value of `id` is your **chat ID**.

### 3. Deploy Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/) and create a new project.
2. Replace the default code in the script editor with the contents of `kode.gas`:

   ```javascript
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
       if (text.startsWith("/start")) {
         sendMessage({
           chat_id: chatId,
           text: `🙋🏽 Halo, ${first_name}!\n\n` +
                 `buatan Alif.\n\n` +
                 `Selamat datang di Bot Anda! Silakan gunakan perintah yang tersedia untuk melanjutkan.`
         });
       } else {
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
   ```

3. Create another file in the same project and add the contents of `webhook.gs`:

   ```javascript
   // CONFIGURATION
   var token = "YOUR_BOT_TOKEN"; // Your Telegram bot token
   var url = "YOUR_GOOGLE_APPS_SCRIPT_URL"; // Your Google Apps Script URL

   // Function to set the Telegram webhook
   function setWebhook() {
     var apiEndpoint = `https://api.telegram.org/bot${token}/setWebhook?url=${url}`;

     try {
       // Make the HTTP request to set the webhook
       var response = UrlFetchApp.fetch(apiEndpoint);
       
       // Log the response to the Logger for debugging
       Logger.log(response.getContentText());
     } catch (error) {
       Logger.log("Error setting webhook: " + error);
     }
   }
   ```

### 4. Set Up Webhook

1. Replace `YOUR_BOT_TOKEN` and `YOUR_GOOGLE_APPS_SCRIPT_URL` in `webhook.gs` with your actual bot token and the URL of your Google Apps Script.
2. Save your project and click on `Deploy > New deployment`.
3. Select `Web app`, give it a name, and ensure to set the access to "Anyone".
4. Deploy the web app and copy the provided URL.
5. Run the `setWebhook` function in `webhook.gs` to set the webhook for your bot.

## Customizing the Bot

- You can customize the message sent to users when they type `/start` by modifying the text in the `sendMessage` function inside `handleCommands`.
- You can add additional commands by extending the `handleCommands` function.

## License

This project is licensed under the MIT License. Feel free to modify and use it as you wish.
```

Feel free to make any further modifications!
