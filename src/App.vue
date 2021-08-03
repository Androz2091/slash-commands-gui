<template>
    <div>
        <NavigationBar />
        <div
            v-if="!state.isLogged && $route.name !== 'Settings'"
            class="text-center mt-28"
        >
            You are not logged. Go to the <router-link
                to="/settings"
                tag="a"
                class="hover:underline text-discord"
            >
                settings page
            </router-link> to start exploring Slash Commands of your bot!
        </div>
        <div
            v-else-if="missingScope && $route.name !== 'Settings'"
            class="text-center mt-28"
        >
            You selected a guild (<code>{{ state.selectedGuildID }}</code>) on which your bot can't create Slash Commands OR the guild doesn't exist.
            <br>
            You can authorize it by clicking <a
                :href="`https://discord.com/api/oauth2/authorize?client_id=${state.clientID}&scope=applications.commands&guild_id=${state.selectedGuildID}&disable_guild_select=true`"
                class="link"
                target="_blank"
            >here</a>, then refresh the page.
        </div>
        <div v-else-if="loading">
            <LoadingAnimation
                :full="true"
                class="vertical-center"
            />
        </div>
        <RouterView v-else />
    </div>
    <footer class="footer bg-darktwo py-4">
        <p class="ml-2">
            Made with <svg
                class="w-6 h-6 inline mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            /></svg> by
            <a
                class="link"
                href="https://github.com/Androz2091"
                target="_blank"
            >Androz2091</a> using <a
                class="hover:underline"
                href="https://v3.vuejs.org"
                target="_blank"
            >Vue.js 3</a> and <a
                class="hover:underline"
                href="https://tailwindcss.com"
                target="_blank"
            >TailwindCSS</a>. The code is publicly available on <a
                class="link"
                href="https://github.com/Androz2091/slash-commands-gui"
                target="_blank"
            >GitHub</a>.
        </p>
    </footer>
</template>

<script>
import { ref } from 'vue';
import decodeJwt from 'jwt-decode';
import { useRouter } from 'vue-router';

import useGlobalState from './store';
import { fetchApplication, fetchCommands } from './api';

import NavigationBar from './components/NavigationBar.vue';
import LoadingAnimation from './components/LoadingAnimation.vue';


export default {
    name: 'App',
    components: {
        NavigationBar,
        LoadingAnimation
    },
    setup () {

        const router = useRouter();

        const {
            state,
            isLogged,
            loadCache,
            updateDiswhoToken,
            updateClientName,
            updateCommands
        } = useGlobalState();

        // retrieve saved state from local storage
        loadCache();

        // update diswho token if one is sent to the app
        const diswhoJwt = new URLSearchParams(window.location.search).get('diswhoJwt');
        if (diswhoJwt) {
            updateDiswhoToken(diswhoJwt);
            router.replace({ path: '/', query: {} });
        } else if (!state.diswhoToken || (state.diswhoToken && decodeJwt(state.diswhoToken.value).expirationTimestamp < Date.now())) {
            return window.location.replace(`https://diswho.androz2091.fr?returnUrl=${window.location.href}`);
        }

        const loading = ref(false);
        const missingScope = ref(false);

        function loadCommands () {

            missingScope.value = false;
            loading.value = true;

            if (!isLogged) {
                loading.value = false;
                router.push('/settings');
                return;
            }

            const startAt = Date.now();
            fetchCommands(state.clientId, state.token, state.guildId)
                .then(async (commands) => {
                    const app = await fetchApplication(state.clientId, state.diswhoToken).catch(() => {});
                    if (app) updateClientName(app.username + '#' + app.discriminator);
                    setTimeout(() => {
                        updateCommands(commands);
                        loading.value = false;
                    }, (startAt - Date.now()) + 500); // wait at least 500ms with the loading animation
                })
                .catch((err) => {
                    loading.value = false;
                    if (err.response.status === 403) missingScope.value = true;
                    else router.push('/settings');
                });
        }

        loadCommands();

        return {
            loading,
            missingScope,
            state: useGlobalState(),
            loadCommands
        };

    }
};
</script>

<style lang="scss" scoped>
.vertical-center {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
</style>
