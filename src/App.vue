<template>
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
</template>

<script>
import { fetchCommands } from './api';
import NavigationBar from './components/NavigationBar.vue';

export default {
    name: 'App',
    components: {
        NavigationBar
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
            if (!this.$store.getters.logged) {
                this.loading = false;
                this.$router.push('/settings');
            } else {
                fetchCommands(this.$store.state.token, this.$store.state.proxyURL, this.$store.getters.applicationID, this.$store.state.selectedGuildID).then((commands) => {
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
