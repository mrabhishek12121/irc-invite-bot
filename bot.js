const irc = require('irc-up');

const client = new irc.Client('irc.hybridirc.com', 'InviteBot', {
    channels: ['#allindiachat.com', '#friendchat'],
    port: 6697,
    secure: true,
    realName: 'InviteBot'
});

const sourceChannels = ['#allindiachat.com'];
const targetChannel = '#friendchat';
let inviteCount = 0;
let lastResetTime = Date.now();
const maxInvitesPerMinute = 10;

client.addListener('registered', () => {
    console.log('[+] Connected as InviteBot');
});

client.addListener('join', (channel, nick) => {
    if (nick === client.nick) return;

    if (sourceChannels.includes(channel)) {
        if (Date.now() - lastResetTime > 60000) {
            inviteCount = 0;
            lastResetTime = Date.now();
        }
        if (inviteCount >= maxInvitesPerMinute) return;

        inviteCount++;
        client.send('INVITE', nick, targetChannel);
        console.log(`[+] Invited ${nick} to ${targetChannel}`);
    }
});

client.addListener('error', (message) => {
    console.error('[-] IRC Error:', message);
});
