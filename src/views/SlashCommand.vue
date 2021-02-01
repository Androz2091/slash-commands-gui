<template>
    <div class="px-4 my-12 space-y-10">
        <h1 class="text-center text-2xl md:text-3xl font-semibold">
            Configuration of /{{ command.name }}
        </h1>
        <form
            class="max-w-3xl mx-auto bg-darkone py-4 px-4 rounded"
            @submit.prevent="updateCommand"
        >
            <h1 class="text-2xl my-4">
                Command Settings
            </h1>
            <div class="space-y-2 my-4">
                <label for="description">Description</label>
                <input
                    v-model="description"
                    class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                    name="description"
                >
                <span
                    v-if="incorrectDescription"
                    class="text-red-400"
                >
                    Command description is required!
                </span>
            </div>
            <div>
                <!-- TODO: fix difference of height between both buttons when loading -->
                <button
                    type="submit"
                    class="bg-discord rounded py-2 px-4 focus:outline-none focus:border-white w-full md:w-auto"
                    :class="updateCommandButtonClass"
                    :disabled="updateCommandLoading"
                >
                    <svg
                        v-if="updateCommandLoading"
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
                    Update command
                </button>
                <button
                    class="bg-red-600 rounded py-2 px-4 focus:outline-none focus:border-white w-full my-1 md:my-0 md:w-auto md:mx-4"
                    :class="deleteCommandButtonClass"
                    :disabled="deleteCommandLoading"
                >
                    <svg
                        v-if="deleteCommandLoading"
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
                    Delete command
                </button>
            </div>
        </form>
        <div class="max-w-3xl mx-auto bg-darkone py-4 px-4 rounded">
            <h1 class="text-2xl my-4">
                Command Parameters
            </h1>
            <SlashCommandOption
                v-for="option in command.options"
                :key="option.name"
                :option="option"
            />
        </div>
    </div>
</template>

<script>
import { deleteCommand, updateCommand } from '../api';
import SlashCommandOption from '../components/SlashCommandOption.vue';
export default {
    name: 'SlashCommand',
    components: {
        SlashCommandOption
    },
    data () {
        return {
            description: '',

            updateCommandLoading: false,
            deleteCommandLoading: false
        }
    },
    computed: {
        updateCommandButtonClass () {
            return this.updateCommandLoading ? 'inline-flex items-center cursor-not-allowed' : '';
        },
        deleteCommandButtonClass () {
            return this.deleteCommandLoading ? 'inline-flex items-center cursor-not-allowed' : '';
        },
        incorrectDescription () {
            return !(this.description);
        },
        command () {
            return this.$store.state.commands.find((cmd) => cmd.id === this.$route.params.commandID)
        }
    },
    mounted () {
        this.description = this.command.description;
    },
    methods: {
        updateCommand () {
            this.updateCommandLoading = true;
            const newCommand = this.command;
            newCommand.description = this.description;
            updateCommand(this.$store.state.token, this.$store.state.proxyURL, this.$store.getters.applicationID, this.$store.state.selectedGuildID, newCommand).then(() => {
                this.$store.dispatch('updateCommand', newCommand);
                this.updateCommandLoading = false;
            });
        },
        deleteCommand () {
            this.deleteCommandLoading = true;
            deleteCommand(this.$store.state.token, this.$store.state.proxyURL, this.$store.getters.applicationID, this.$store.state.selectedGuildID, this.command.id).then(() => {
                this.$store.dispatch('deleteCommand', this.command.id);
                this.deleteCommandLoading = false;
                this.$router.push('/');
            });
        }
    }
}
</script>

<style scoped>
input {
    background-color: #373c42;
    width: 100%;
}
</style>
