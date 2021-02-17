<template>
    <form
        class="px-4 my-10 md:my-32 max-w-3xl mx-auto space-y-6"
        @submit.prevent="onSubmit"
    >
        <h1 class="text-3xl font-semibold">
            Slash Commands GUI Settings
        </h1>
        <div class="space-y-2">
            <label for="clientid">Client ID</label>
            <input
                v-model="clientID"
                class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                name="clientid"
            >
            <span
                v-if="incorrectClientID"
                class="text-red-400"
            >
                This client ID is not valid!
            </span>
            <span
                v-if="incorrectCredentials"
                class="text-red-400"
            >
                These credentials are incorrect, please verify this field
            </span>
            <p class="text-gray-400 leading-tight text-xs">
                The client ID of your application can be found on your <a
                    href="https://discord.dev/"
                    class="link"
                    target="_blank"
                >Discord developer dashboard</a>.
            </p>
        </div>
        <div class="space-y-2">
            <label for="clientsecret">Client Secret</label>
            <input
                v-model="clientSecret"
                class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                name="clientsecret"
            >
            <span
                v-if="incorrectClientSecret"
                class="text-red-400"
            >
                This client secret is not valid!
            </span>
            <span
                v-if="incorrectCredentials"
                class="text-red-400"
            >
                These credentials are incorrect, please verify this field
            </span>
            <p class="text-gray-400 leading-tight text-xs">
                The client secret of your application can be found on your <a
                    href="https://discord.dev/"
                    target="_blank"
                    class="link"
                >Discord developer dashboard</a>. It won't be stored in your browser and will only be used to generate an OAuth2 token.
            </p>
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
            <p class="text-gray-400 leading-tight text-xs">
                Fill this field if you want to access the slash commands of a specific guild.
            </p>
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
            <p class="text-gray-400 leading-tight text-xs">
                Discord does not allow API calls from the browser. We need to use a CORS Proxy so all the calls are made by it and it returns a response. You can host your own cors proxy (cors-anywhere) and enter the URL here.
            </p>
        </div>
        <button
            type="submit"
            class="bg-discord rounded py-2 px-4 focus:outline-none focus:border-white"
            :class="submitButtonClass"
            :disabled="loading || (incorrectClientID || incorrectClientSecret || incorrectGuildID || incorrectProxyURL)"
        >
            <LoadingAnimation v-if="loading" />
            <div v-else>
                Submit
            </div>
        </button>
    </form>
</template>

<script>
import { getToken, fetchApplication } from '../api';
import LoadingAnimation from '../components/LoadingAnimation.vue';

export default {
    name: 'Settings',
    components: {
        LoadingAnimation
    },
    data () {
        return {
            clientID: '',
            clientSecret: '',
            guildID: '',
            proxyURL: '',

            invalidClientCredentials: new Set(),
            invalidProxyURLs: new Set(),
            invalidGuildIDs: new Set(),

            loading: false
        };
    },
    computed: {
        submitButtonClass () {
            return this.loading ? 'inline-flex items-center cursor-not-allowed' : '';
        },
        incorrectClientID () {
            return !(this.clientID && /[0-9]{16,32}/.test(this.clientID));
        },
        incorrectClientSecret () {
            return !(this.clientSecret && /([a-zA-Z0-9-_]{32})/.test(this.clientSecret));
        },
        incorrectGuildID () {
            return this.guildID && !(/[0-9]{16,32}/.test(this.guildID) && !this.invalidGuildIDs.has(this.guildID));
        },
        incorrectProxyURL () {
            return !(this.proxyURL && /^https:\/\//.test(this.proxyURL) && !this.invalidProxyURLs.has(this.proxyURL));
        },
        incorrectCredentials () {
            return this.invalidClientCredentials.has(`${this.clientID}${this.clientSecret}`);
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
        this.clientID = this.$store.state.clientID;
        this.proxyURL = this.$store.state.proxyURL;
        if (this.$store.state.selectedGuildID) this.guildID = this.$store.state.selectedGuildID;
        if (this.$store.state.showProxyURLInput) this.$refs.proxyURLInput.classList.remove('hidden');
    },
    methods: {
        onSubmit () {
            this.loading = true;
            this.$store.dispatch('deleteToken');
            this.$store.dispatch('updateSettings', {
                clientID: this.clientID,
                selectedGuildID: this.guildID,
                proxyURL: this.proxyURL
            });
            getToken(this.clientID, this.clientSecret, this.proxyURL).then((tokenData) => {
                if (!tokenData) {
                    this.invalidClientCredentials.add(`${this.clientID}${this.clientSecret}`);
                    this.loading = false;
                } else {
                    this.$store.dispatch('saveToken', {
                        expiresAt: Date.now() + (tokenData.expires_in * 1000),
                        value: tokenData.access_token
                    });
                    fetchApplication(this.$store.state.clientID).then((application) => {
                        this.$toast.success(`Successfully logged in as ${application.username}!`, {
                            duration: 10000,
                            pauseOnHover: true
                        });
                        this.$router.push('/');
                    });
                    this.loading = false;
                    this.$root.loadCommands();
                }
            }).catch(() => {
                this.loading = false;
                this.invalidProxyURLs.add(this.proxyURL);
            });
        }
    }
};
</script>
