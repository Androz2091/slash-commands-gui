import axios from 'axios';

const getURL = (clientID, guildID, commandID) => `applications/${clientID}/${guildID ? `guilds/${guildID}/` : ''}${commandID ? `commands/${commandID}` : 'commands'}`;

export function request (token, proxyURL, url, method, data) {
    return new Promise((resolve, reject) => {
        axios({
            url: `${proxyURL}/https://discord.com/api/v8/${url}`,
            method,
            data: method === 'POST' ? JSON.stringify(data) : undefined,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then((value) => {
            resolve(value.data);
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * Obtain an Oauth2 token from a client ID and a client secret
 * @param {string} clientID 
 * @param {string} clientSecret 
 * @param {string} proxyURL 
 * @returns {Promise<Object>}
 */
export function getToken (clientID, clientSecret, proxyURL) {
    return new Promise((resolve, reject) => {
        const data = new URLSearchParams();
        data.append('grant_type', 'client_credentials');
        data.append('scope', 'applications.commands.update');
        axios({
            url: `${proxyURL}/https://discord.com/api/oauth2/token`,
            method: 'POST',
            data: data.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${btoa(`${clientID}:${clientSecret}`)}`
            }
        }).then((value) => {
            resolve(value.data);
        }).catch((err) => {
            reject(err);
        });
    });
}

export function fetchCommands (clientID, token, proxyURL, guildID) {
    const url = getURL(clientID, guildID);
    return request(token, proxyURL, url, 'GET');
}

export function updateCommand (clientID, token, proxyURL, guildID, command) {
    const url = getURL(clientID, guildID);
    return request(token, proxyURL, url, 'POST', command);
}

export function deleteCommand (clientID, token, proxyURL, guildID, commandID) {
    const url = getURL(clientID, guildID, commandID);
    return request(token, proxyURL, url, 'DELETE');
}

export function createCommand (clientID, token, proxyURL, guildID, commandData) {
    const url = getURL(clientID, guildID);
    return request(token, proxyURL, url, 'POST', commandData);
}

export function fetchApplication (clientID) {
    const url = `https://diswho.androz2091.fr/user/${clientID}`;
    return axios({
        url
    }).then((value) => {
        return value.data;
    });
}
