const irc = require('irc');

// Configuration
const targetChannel = '#ndianchatarea'; // Change to your new channel name
const botNames = [
    'User_Alex',
    'User_Priya',
    'User_Rahul',
    'User_Sam',
    'User_Jessica',
    'User_David',
    'User_Neha'
];

const bots = [];

// Spawn each fake user connection
botNames.forEach((nick, index) => {
    // Stagger connections by 3 seconds to avoid server rate-limits
    setTimeout(() => {
        const client = new irc.Client('irc.hybridirc.com', nick, {
            channels: [targetChannel],
            port: 6697,
            secure: true,
            autoConnect: true
        });

        client.addListener('registered', () => {
            console.log(`[+] ${nick} connected to ${targetChannel}`);
        });

        client.addListener('error', (message) => {
            console.error(`[-] Error for ${nick}:`, message);
        });

        bots.push(client);
    }, index * 3000);
});
