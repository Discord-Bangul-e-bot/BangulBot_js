import MyClient from 'src/bot/MyClient';

const client = new MyClient({ intents: ['Guilds', 'GuildMessages', 'MessageContent'] });

export default client;
