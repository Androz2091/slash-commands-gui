<template>
    <div>
        <NavigationBar />
        <div
            v-if="!$store.getters.logged && $route.name !== 'Settings'"
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
            v-if="missingScope && $route.name !== 'Settings'"
            class="text-center mt-28"
        >
            You selected a guild (<code>{{ $store.state.selectedGuildID }}</code>) on which your bot can't create Slash Commands. You can authorize it by clicking <a
                :href="`https://discord.com/api/oauth2/authorize?client_id=${$store.state.clientID}&scope=applications.commands&guild_id=${$store.state.selectedGuildID}&disable_guild_select=true`"
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
import { fetchCommands } from './api';
import NavigationBar from './components/NavigationBar.vue';
import LoadingAnimation from './components/LoadingAnimation.vue';

export default {
    name: 'App',
    components: {
        NavigationBar,
        LoadingAnimation
    },
    data () {
        return {
            loading: true,
            missingScope: false
        };
    },
    created () {
        this.$store.dispatch('loadSettingsCache');
        this.loadCommands();
    },
    methods: {
        loadCommands () {
            this.loading = true;
            if (!this.$store.getters.logged || !this.$store.getters.isTokenActive) {
                this.loading = false;
                this.$router.push('/settings');
            } else {
                const startAt = Date.now();
                fetchCommands(this.$store.state.clientID, this.$store.state.token.value, this.$store.state.proxyURL, this.$store.state.selectedGuildID).then((commands) => {
                    if (!commands) {
                        this.loading = false;
                        this.missingScope = true;
                    } else {
                        setTimeout(() => {
                            this.$store.commit('SET_COMMANDS', commands);
                            this.loading = false;
                        }, (Date.now() - startAt) + 100);
                    }
                }).catch(() => {
                    this.loading = false;
                    this.$router.push('/settings');
                });
            }
        }
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
