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
                v-if="clientIDInputError"
                class="text-red-400"
            >
                {{ clientIDInputError }}
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
                v-if="clientSecretInputError"
                class="text-red-400"
            >
                {{ clientSecretInputError }}
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
                v-if="guildIDInputError"
                class="text-red-400"
            >
                {{ guildIDInputError }}
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
                v-if="proxyURLInputError"
                class="text-red-400"
            >
                {{ proxyURLInputError }}
            </span>
            <p class="text-gray-400 leading-tight text-xs">
                Discord does not allow API calls from the browser. We need to use a CORS Proxy so all the calls are made by it and it returns a response. You can host your own cors proxy (cors-anywhere) and enter the URL here.
            </p>
        </div>
        <button
            type="submit"
            class="bg-discord rounded py-2 px-4 focus:outline-none focus:border-white"
            :class="submitButtonClass"
            :disabled="loading || clientIDInputError || clientSecretInputError || guildIDInputError || proxyURLInputError"
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

            loading: false
        };
    },
    computed: {
        submitButtonClass () {
            return this.loading ? 'inline-flex items-center cursor-not-allowed' : '';
        },
        clientIDInputError () {
            const clientIDEmpty = this.clientID.length === 0;
            if (clientIDEmpty) return 'The client ID field is required!';
            const invalidClientID = !(/[0-9]{16,32}/.test(this.clientID));
            if (invalidClientID) return 'This client ID is not invalid!';
            if (this.incorrectCredentials) return 'These credentials are invalid, please verify this field!';
            return null;
        },
        clientSecretInputError () {
            const clientSecretEmpty = this.clientSecret.length === 0;
            if (clientSecretEmpty) return 'The client secret field is required!';
            const invalidClientSecret = !(/([a-zA-Z0-9-_]{32})/.test(this.clientSecret));
            if (invalidClientSecret) return 'This client secret is not valid!';
            if (this.incorrectCredentials) return 'These credentials are invalid, please verify this field!';
            return null;
        },
        guildIDInputError () {
            if (!this.guildID) return null;
            const invalidGuildID = !(/[0-9]{16,32}/.test(this.guildID));
            if (invalidGuildID) return 'This guild ID is not valid!';
            return null;
        },
        proxyURLInputError () {
            const proxyURLEmpty = this.proxyURL.length === 0;
            if (proxyURLEmpty) return 'The proxy URL is required!';
            const invalidProxyURL = !(/^https:\/\//.test(this.proxyURL)) || this.invalidProxyURLs.has(this.proxyURL);
            if (invalidProxyURL) return 'This proxy URL is not valid!';
            return null;
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
        this.clientID = this.$store.state.clientID || '';
        this.proxyURL = this.$store.state.proxyURL || '';
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
            }).catch((err) => {
                this.loading = false;
                if (!err.response) this.invalidProxyURLs.add(this.proxyURL);
                else this.invalidClientCredentials.add(`${this.clientID}${this.clientSecret}`);
            });
        }
    }
};
</script>
