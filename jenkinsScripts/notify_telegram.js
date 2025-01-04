const TelegramBot = require("node-telegram-bot-api");
const chatID = process.argv[2];
const botToken = process.argv[3];
const bot = new TelegramBot(botToken, { polling: true });
const message = `
S'ha executat la pipeline de jenkins amb els següents resultats:
- Linter_stage: ${process.argv[4]}
- Test_stage: ${process.argv[5]}
- Update_readme_stage: ${process.argv[6]}
- Deploy_to_Vercel_stage: ${process.argv[7]}
`;
bot.sendMessage(chatID, message)
    .then(data => {
        console.log("Telegram sended");
        process.exit(0);
    })
    .catch(e => process.exit(1));