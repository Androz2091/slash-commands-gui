import { computed, reactive, readonly } from 'vue';

const state = reactive({
    clientId: null,
    clientName: null,
    guildId: null,
    token: {
        value: null,
        expiresAt: null
    },
    commands: null,
    diswhoToken: null
});

export default function useGlobalState () {

    const loadCache = () => {
        const rawState = localStorage.getItem('state');
        if (rawState) {
            const credentials = JSON.parse(rawState);
            state.clientId = credentials.clientId;
            state.clientName = credentials.clientName;
            state.guildId = credentials.guildId;
            state.token.value = credentials.token;
            state.token.expiresAt = credentials.expiresAt;
            state.diswhoToken = credentials.diswhoToken;
        }
    };

    const updateCredentials = function (clientId, guildId, token) {
        state.clientId = clientId;
        state.guildId = guildId;
        state.token.value = token.value;
        state.token.expiresAt = Date.now() + token.expires_in * 1000;
    };

    const updateDiswhoToken = function (token) {
        state.diswhoToken = token;
    };

    const updateCommands = function (commands) {
        state.commands = commands;
    };

    const updateClientName = function (clientName) {
        state.clientName = clientName;
    };

    const isLogged = computed(() => state.clientId && state.token.value && state.token.expiresAt > Date.now());

    return {
        state: readonly(state),
        loadCache,
        updateDiswhoToken,
        updateCredentials,
        updateCommands,
        updateClientName,

        isLogged
    };

}
