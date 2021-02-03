<template>
    <form
        class="px-4 my-32 max-w-3xl mx-auto space-y-6"
        @submit.prevent="onSubmit"
    >
        <h1 class="text-3xl font-semibold">
            Slash Commands GUI Settings
        </h1>
        <div class="space-y-2">
            <label for="token">Token</label>
            <input
                v-model="token"
                class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                name="token"
            >
            <span
                v-if="incorrectToken"
                class="text-red-400"
            >
                This token is not valid!
            </span>
        </div>
        <div class="space-y-2">
            <label for="guildid">Guild ID</label>
            <input
                v-model="guildID"
                class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                name="guildid"
            >
            <span
                v-if="incorrectGuildID"
                class="text-red-400"
            >
                This ID is not valid!
            </span>
        </div>
        <div
            ref="proxyURLInput"
            class="space-y-2 hidden"
        >
            <label for="token">Proxy URL</label>
            <input
                v-model="proxyURL"
                class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                name="proxyURL"
            >
            <span
                v-if="incorrectProxyURL"
                class="text-red-400"
            >
                This proxy URL is not valid!
            </span>
        </div>
        <button
            type="submit"
            class="bg-discord rounded py-2 px-4 focus:outline-none focus:border-white"
            :class="submitButtonClass"
            :disabled="loading || (incorrectToken || incorrectGuildID || incorrectProxyURL)"
        >
            <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                />
                <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
            Submit
        </button>
    </form>
</template>

<script>
import { fakePromise } from '../util/helpers';
import { fetchApplication, fetchGuild } from '../api';

export default {
    name: 'Settings',
    emits: ['load-commands'],
    data () {
        return {
            token: '',
            guildID: '',
            proxyURL: '',

            invalidTokens: new Set(),
            invalidProxyURLs: new Set(),
            invalidGuildIDs: new Set(),

            loading: false
        };
    },
    computed: {
        submitButtonClass () {
            return this.loading ? 'inline-flex items-center cursor-not-allowed' : '';
        },
        incorrectToken () {
            return !(this.token && /[A-Za-z\d]{24}\.[\w-]{6}\.[\w-]{27}/.test(this.token) && !this.invalidTokens.has(this.token));
        },
        incorrectGuildID () {
            return this.guildID && !(/[0-9]{16,32}/.test(this.guildID) && !this.invalidGuildIDs.has(this.guildID));
        },
        incorrectProxyURL () {
            return !(this.proxyURL && /^https:\/\//.test(this.proxyURL) && !this.invalidProxyURLs.has(this.proxyURL));
        }
    },
    watch: {
        '$store.state.showProxyURLInput' (newValue) {
            if (newValue) {
                this.$refs.proxyURLInput.classList.remove('hidden');
            }
        }
    },
    mounted () {
        this.token = this.$store.state.token;
        this.guildID = this.$store.state.selectedGuildID;
        this.proxyURL = this.$store.state.proxyURL;
        if (this.$store.state.showProxyURLInput) this.$refs.proxyURLInput.classList.remove('hidden');
    },
    methods: {
        onSubmit () {
            this.loading = true;
            this.$store.dispatch('updateSettings', {
                token: this.token,
                selectedGuildID: this.guildID,
                proxyURL: this.proxyURL
            });
            fetchApplication(this.token, this.proxyURL, this.guildID).then((application) => {
                if (!application) this.invalidTokens.add(this.token);
                else {
                    const fetchGuildPromise = this.guildID ? fetchGuild(this.token, this.proxyURL, this.guildID) : fakePromise();
                    fetchGuildPromise.then((guild) => {
                        if (this.guildID && !guild) {
                            this.loading = false;
                            this.invalidGuildIDs.add(this.guildID);
                        } else {
                            this.$store.commit('UPDATE_GUILD', guild);
                            // TODO: add the toast once https://github.com/MeForma/vue-toaster/issues/12 is fixed
                            // this.$toast.show(`Logged as ${application.username}!`);
                            this.$router.push('/');
                            this.loading = false;
                            this.$emit('load-commands');
                        }
                    });
                }
            }).catch(() => {
                this.loading = false;
                this.invalidProxyURLs.add(this.proxyURL);
            });
        }
    }
};
</script>

<style scoped>
input {
    background-color: #373c42;
    width: 100%;
}
</style>
