<template>
    <div class="s">
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
        <div v-else-if="loading">
            <div class="ball-pulse smallBall vertical-center text-center">
                <div />
                <div />
                <div />
            </div>
        </div>
        <!-- TODO: Fix Extraneous non-emits event listeners (loadCommands) warning -->
        <RouterView
            v-else
            @load-commands="loadCommands"
        />
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
            /></svg> by <Link
                to="https://github.com/Androz2091"
                content="Androz2091"
            /> using <Link
                :color="false"
                to="https://v3.vuejs.org"
                content="Vue.js 3"
            /> and  <Link
                :color="false"
                to="https://tailwindcss.com"
                content="TailwindCSS"
            />. The code is publicly available on <Link
                to="https://github.com/Androz2091/slash-commands-gui"
                content="GitHub"
            />.
        </p>
    </footer>
</template>

<script>
import { fetchCommands } from './api';
import NavigationBar from './components/NavigationBar.vue';
import Link from './components/Link.vue';

export default {
    name: 'App',
    components: {
        NavigationBar,
        Link
    },
    data () {
        return {
            loading: true
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
                fetchCommands(this.$store.state.clientID, this.$store.state.token.value, this.$store.state.proxyURL, this.$store.state.selectedGuildID).then((commands) => {
                    this.commands = commands;
                    this.$store.commit('SET_COMMANDS', commands);
                    this.loading = false;
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
.ball-pulse > div:first-child {
    -webkit-animation: scale .75s cubic-bezier(.2, .68, .18, 1.08) -.24s infinite;
    animation: scale .75s cubic-bezier(.2, .68, .18, 1.08) -.24s infinite;
}
.ball-pulse > div:nth-child(2) {
    -webkit-animation: scale .75s cubic-bezier(.2, .68, .18, 1.08) -.12s infinite;
    animation: scale .75s cubic-bezier(.2, .68, .18, 1.08) -.12s infinite;
}
.ball-pulse > div:nth-child(3) {
    -webkit-animation: scale .75s cubic-bezier(.2, .68, .18, 1.08) 0s infinite;
    animation: scale .75s cubic-bezier(.2, .68, .18, 1.08) 0s infinite;
}
.ball-pulse > div {
    background-color: #fff;
    width: 15px;
    height: 15px;
    border-radius: 100%;
    margin: 2px;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    display: inline-block;
    margin-top: 0;
    margin-bottom: -.2rem
}
.vertical-center {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
.smallBall > div {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin: 1px
}
@-webkit-keyframes scale {
    0% {
        transform: scale(1);
        opacity: 1;
        -ms-filter: none;
        filter: none
    }
    45% {
        transform: scale(.1);
        opacity: .7;
        -ms-filter: "alpha(opacity=70)";
        filter: alpha(opacity=70)
    }
    80% {
        transform: scale(1);
        opacity: 1;
        -ms-filter: none;
        filter: none
    }
}
@keyframes scale {
    0% {
        transform: scale(1);
        opacity: 1;
        -ms-filter: none;
        filter: none
    }
    45% {
        transform: scale(.1);
        opacity: .7;
        -ms-filter: "alpha(opacity=70)";
        filter: alpha(opacity=70)
    }
    80% {
        transform: scale(1);
        opacity: 1;
        -ms-filter: none;
        filter: none
    }
}
</style>
