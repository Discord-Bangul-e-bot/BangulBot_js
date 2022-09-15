// const Discord = require('discord.js');
import Discord from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
// PARAM token
const token = process.env.DISCORD_TOKEN;
// TODO: .env에서 설정해주세요~!@
const PREFIX = process.env.PREFIX || '고양이';
console.log(token);
const client = new Discord.Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent'] });
// NOTE: 봇 실행시 실행
client.once('ready', () => {
    console.log('MEOW');
});
// FIXME: 상호작용 방법을 찾아야됨
client.on('interactionCreate', async (interaction) => {
    console.log('interaction Create');
    if (!interaction.isChatInputCommand())
        return;
    if (interaction.commandName === 'stats') {
        await interaction.reply(`Server count: ${client.guilds.cache.size}.`);
    }
});
// NOTE: 작동함
client.on('messageCreate', async (interaction) => {
    console.log(interaction);
    // NOTE: PREFIX를 커스텀으로 설정 할 수 있음
    if (!interaction.content.startsWith(PREFIX))
        return;
    interaction.reply('야옹');
});
// FIXME: 상호작용 방법을 찾아야됨
client.on('message', (message) => {
    console.log(message.content);
});
client.login(token);
// export default client;
//# sourceMappingURL=index.js.map