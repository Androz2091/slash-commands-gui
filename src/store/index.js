import { createStore } from 'vuex'

// Create a new store instance.
export default createStore({
    state () {
        return {

            // settings. they will be cached in the local storage
            token: null,
            proxyURL: null,
            selectedGuildID: null,
            showProxyURLInput: false,

            // data loaded on each page load
            guild: null,
            commands: null
        }
    },
    getters: {
        logged (state) {
            return state.token && state.proxyURL;
        },
        applicationID (state) {
            const encodedApplicationID = state.token.match(/([A-Za-z\d]{24})\.[\w-]{6}\.[\w-]{27}/);
            return atob(encodedApplicationID[1]);
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
            localStorage.setItem('token', settings.token);
            localStorage.setItem('proxyURL', settings.proxyURL);
            localStorage.setItem('selectedGuildID', settings.selectedGuildID);
            commit('UPDATE_SETTINGS', settings);
        },
        loadSettingsCache ({ commit }) {
            const token = localStorage.getItem('token');
            const proxyURL = localStorage.getItem('proxyURL') ?? 'https://cors-anywhere.androz2091.fr';
            const showProxyURLInput = Boolean(localStorage.getItem('showProxyURLInput')) || false;
            const selectedGuildID = localStorage.getItem('selectedGuildID');
            commit('UPDATE_SETTINGS', {
                token,
                proxyURL,
                showProxyURLInput,
                selectedGuildID
            });
        }
    },
    mutations: {
        SHOW_PROXY_URL_INPUT (state) {
            state.showProxyURLInput = true;
        },
        UPDATE_SETTINGS (state, settings) {
            state.token = settings.token;
            state.proxyURL = settings.proxyURL;
            state.showProxyURLInput = settings.showProxyURLInput;
            state.selectedGuildID = settings.selectedGuildID;
        },
        UPDATE_GUILD (state, guild) {
            state.guild = guild;
        },
        SET_COMMANDS (state, commands) {
            state.commands = commands;
        }
    }
});
