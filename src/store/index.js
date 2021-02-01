import { createStore } from 'vuex'

// Create a new store instance.
export default createStore({
    state () {
        return {

            // settings. they will be cached in the local storage
            token: null,
            proxyURL: 'https://cors-anywhere.androz2091.fr',
            selectedGuildID: null,

            // data loaded on each page load
            applicationID: null,
            commands: null
        }
    },
    actions: {
        loadSettingsCache ({ commit }) {
            const token = localStorage.getItem('token');
            const proxyURL = localStorage.getItem('proxyURL');
            const selectedGuildID = localStorage.getItem('selectedGuildID');
            commit('UPDATE_SETTINGS', {
                token,
                proxyURL,
                selectedGuildID
            });
        }
    },
    mutations: {
        UPDATE_SETTINGS (state, settings) {
            state.token = settings.token;
            state.proxyURL = settings.proxyURL;
            state.selectedGuildID = settings.selectedGuildID;
        }
    }
});
