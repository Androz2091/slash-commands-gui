import axios from 'axios';

const getURL = (clientID, guildID, commandID) => `applications/${clientID}/${guildID ? `guilds/${guildID}/` : ''}${commandID ? `commands/${commandID}` : 'commands'}`;

export function request (token, url, method, data) {
    return new Promise((resolve, reject) => {
        axios({
            url: `https://discord.com/api/v8/${url}`,
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
 * @returns {Promise<Object>}
 */
export function getToken (clientID, clientSecret) {
    return new Promise((resolve, reject) => {
        const data = new URLSearchParams();
        data.append('grant_type', 'client_credentials');
        data.append('scope', 'applications.commands.update');
        axios({
            url: 'https://discord.com/api/oauth2/token',
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

export function fetchCommands (clientID, token, guildID) {
    const url = getURL(clientID, guildID);
    return request(token, url, 'GET');
}

export function updateCommand (clientID, token, guildID, command) {
    const url = getURL(clientID, guildID);
    return request(token, url, 'POST', command);
}

export function deleteCommand (clientID, token, guildID, commandID) {
    const url = getURL(clientID, guildID, commandID);
    return request(token, url, 'DELETE');
}

export function createCommand (clientID, token, guildID, commandData) {
    const url = getURL(clientID, guildID);
    return request(token, url, 'POST', commandData);
}

export function fetchApplication (clientID, token) {
    const url = `https://diswho.androz2091.fr/user/${clientID}`;
    return axios({
        url,
        headers: {
            Authorization: 'Bearer ' + token
        }
    }).then((value) => {
        return value.data;
    });
}
