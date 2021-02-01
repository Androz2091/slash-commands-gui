import axios from 'axios';

export function request (token, proxyURL, url, method, data) {
    return new Promise((resolve) => {
        axios({
            url: `${proxyURL}/https://discord.com/api/v8/${url}`,
            method,
            data: method === 'POST' ? JSON.stringify(data) : undefined,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bot ${token}`
            }
        }).then((value) => {
            resolve(value.data);
        }).catch(() => {
            resolve(null);
        });
    });
}

export function fetchApplication (token, proxyURL) {
    return request(token, proxyURL, 'users/@me', 'GET');
}

export function fetchGuild (token, proxyURL, guildID) {
    if (!guildID) return new Promise((resolve) => resolve(true));
    return request(token, proxyURL, `guilds/${guildID}`);
}

export function fetchCommands (token, proxyURL, applicationID, guildID) {
    const url = `applications/${applicationID}/${guildID ? `guilds/${guildID}/commands` : 'commands'}`;
    return request(token, proxyURL, url, 'GET');
}

export function updateCommand (token, proxyURL, applicationID, guildID, command) {
    const url = `applications/${applicationID}/${guildID ? `guilds/${guildID}/commands` : 'commands'}`;
    return request(token, proxyURL, url, 'POST', command);
}

export function deleteCommand (token, proxyURL, applicationID, guildID, commandID) {
    const url = `applications/${applicationID}/${guildID ? `guilds/${guildID}/commands/${commandID}` : 'commands'}`;
    return request(token, proxyURL, url, 'DELETE');
}
