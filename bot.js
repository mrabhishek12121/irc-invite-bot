const irc = require('node-irc');

const CONFIG = {
    nickname: 'InviteBot',
    username: 'invitebot',
    server: 'irc.hybridirc.com',             // HybridIRC server address
    port: 6697,
    useSsl: true,
    sourceChannels: ['#allindiachat.com'],   // Channel to watch for users
    targetChannel: '#friendchat',            // Your channel to invite users to
    inviteDelay: 1000,
    maxInvitesPerMinute: 10,
};

let inviteCount = 0;
let lastResetTime = Date.now();

const client = irc.connect(CONFIG);

client.on('connected', () => {
    console.log(`[+] Connected as ${CONFIG.nickname}`);
    CONFIG.sourceChannels.forEach(ch => client.join(ch));
    client.join(CONFIG.targetChannel);
});

client.on('join', (channel, nickname) => {
    if (nickname === CONFIG.nickname) return;
    if (CONFIG.sourceChannels.includes(channel)) {
        handleInvite(nickname);
    }
});

function handleInvite(nickname) {
    if (Date.now() - lastResetTime > 60000) {
        inviteCount = 0;
        lastResetTime = Date.now();
    }
    if (inviteCount >= CONFIG.maxInvitesPerMinute) return;

    inviteCount++;
    client.invite(nickname, CONFIG.targetChannel);
    console.log(`[+] Invited ${nickname} to ${CONFIG.targetChannel}`);
}

client.on('error', (message) => {
    console.error(`[-] Error: ${message.message}`);
});
