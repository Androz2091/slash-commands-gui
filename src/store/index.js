import { createStore } from 'vuex';

// Create a new store instance.
export default createStore({
    state () {
        return {

            // settings. they will be cached in the local storage
            clientID: null,
            proxyURL: 'https://cors-anywhere.androz2091.fr',
            selectedGuildID: null,
            showProxyURLInput: false,

            // Client Secret, used to generate the bearer token. not saved in the browser
            clientSecret: null,

            // token
            token: {
                value: null,
                expiresAt: null
            },

            // data loaded on each reload
            commands: null
        };
    },
    getters: {
        logged (state) {
            return state.clientID && state.proxyURL && state.token && state.token.value;
        },
        isTokenActive (state) {
            return state.token.expiresAt > Date.now();
        }
    },
    actions: {
        showProxyURLInput ({ commit }) {
            localStorage.setItem('showProxyURLInput', true);
            commit('SHOW_PROXY_URL_INPUT');
        },
        updateCommand ({ commit, state }, command) {
            const commands = state.commands;
            const newCommands = commands.filter((cmd) => cmd.id !== command.id);
            newCommands.push(command);
            commit('SET_COMMANDS', newCommands);
        },
        deleteCommand ({ commit, state }, commandID) {
            const commands = state.commands;
            const newCommands = commands.filter((cmd) => cmd.id !== commandID);
            commit('SET_COMMANDS', newCommands);
        },
        updateSettings ({ commit }, settings) {
            localStorage.setItem('clientID', settings.clientID);
            localStorage.setItem('proxyURL', settings.proxyURL);
            localStorage.setItem('selectedGuildID', settings.selectedGuildID);
            commit('UPDATE_SETTINGS', settings);
        },
        loadSettingsCache ({ commit }) {
            const clientID = localStorage.getItem('clientID');
            if (clientID) {
                const proxyURL = localStorage.getItem('proxyURL') ?? 'https://cors-anywhere.androz2091.fr';
                const showProxyURLInput = Boolean(localStorage.getItem('showProxyURLInput')) || false;
                const selectedGuildID = localStorage.getItem('selectedGuildID');
                commit('UPDATE_SETTINGS', {
                    clientID,
                    proxyURL,
                    showProxyURLInput,
                    selectedGuildID
                });
                const token = localStorage.getItem('token');
                let tokenData;
                try {
                    tokenData = JSON.parse(token);
                    commit('UPDATE_TOKEN', tokenData);
                } catch (e) {
                    console.log('Settings loaded but bearer token not be retrieved.');
                }
            }
        },
        saveToken ({ commit }, tokenData) {
            localStorage.setItem('token', JSON.stringify(tokenData));
            commit('UPDATE_TOKEN', tokenData);
        },
        deleteToken ({ commit }) {
            localStorage.removeItem('token');
            commit('UPDATE_TOKEN', null);
        }
    },
    mutations: {
        SHOW_PROXY_URL_INPUT (state) {
            state.showProxyURLInput = true;
        },
        UPDATE_SETTINGS (state, settings) {
            state.clientID = settings.clientID;
            state.proxyURL = settings.proxyURL;
            state.showProxyURLInput = settings.showProxyURLInput;
            state.selectedGuildID = settings.selectedGuildID;
        },
        SET_COMMANDS (state, commands) {
            state.commands = commands.sort((a, b) => a.name.localeCompare(b.name));
        },
        UPDATE_TOKEN (state, token) {
            state.token = token;
        }
    }
});
