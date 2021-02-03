<template>
    <div class="px-4 my-12 space-y-10">
        <h1 class="text-center text-2xl md:text-3xl font-semibold">
            Configuration of /{{ command.name }} {{ subgroup ? subgroup.name : '' }} {{ subcommand.name }}
        </h1>
        <form
            class="max-w-3xl mx-auto bg-darkone py-4 px-4 rounded"
            @submit.prevent="updateSubCommand"
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
                    :class="updateSubCommandButtonClass"
                    :disabled="updateSubCommandLoading"
                >
                    <svg
                        v-if="updateSubCommandLoading"
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
                    :class="deleteSubCommandButtonClass"
                    :disabled="deleteSubCommandLoading"
                >
                    <svg
                        v-if="deleteSubCommandLoading"
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
        <div
            class="max-w-3xl mx-auto bg-darkone py-4 px-4 rounded"
        >
            <h1 class="text-2xl my-4">
                Command Parameters
            </h1>
            <SlashCommandOption
                v-for="option in params"
                :key="option.name"
                :option="option"
            />
            <h1 v-if="params.length === 0">
                No parameters
            </h1>
        </div>
    </div>
</template>

<script>
import { updateCommand } from '../api';
import SlashCommandOption from '../components/SlashCommandOption.vue';
import { cloneObject } from '../util/helpers';

export default {
    name: 'SlashCommand',
    components: {
        SlashCommandOption,
    },
    data () {
        return {
            description: '',

            updateSubCommandLoading: false,
            deleteSubCommandLoading: false
        };
    },
    computed: {
        params () {
            return (this.subcommand.options || []).filter((o) => o.type > 2);
        },
        subcommands () {
            return (this.subcommand.options || []).filter((o) => o.type === 1);
        },
        subcommandgroups () {
            return (this.subcommand.options || []).filter((o) => o.type === 2);
        },
        updateSubCommandButtonClass () {
            return this.updateSubCommandLoading ? 'inline-flex items-center cursor-not-allowed' : '';
        },
        deleteSubCommandButtonClass () {
            return this.deleteSubCommandLoading ? 'inline-flex items-center cursor-not-allowed' : '';
        },
        incorrectDescription () {
            return !(this.description);
        },
        command () {
            return this.$store.state.commands.find((cmd) => cmd.id === this.$route.params.commandID);
        },
        subcommand () {
            return this.subgroup ? this.subgroup.options.find((opt) => opt.name === this.$route.params.commandName) : this.command.options.find((opt) => opt.name === this.$route.params.commandName);
        },
        subgroup () {
            return this.$route.params.groupName ? this.command.options.find((opt) => opt.name === this.$route.params.groupName) : null;
        }
    },
    mounted () {
        this.description = this.subcommand.description;
    },
    methods: {
        updateSubCommand () {
            this.updateSubCommandLoading = true;
            const newCommand = cloneObject(this.command);
            const newSubCommand = cloneObject(this.subcommand);
            if (this.subgroup) {
                const newGroup = cloneObject(this.subgroup);
                newCommand.options = newCommand.options.filter((opt) => opt.name !== this.subgroup.name);
                newGroup.options = newGroup.options.filter((opt) => opt.name !== this.subcommand.name);
                newSubCommand.description = this.description;
                newGroup.options.push(newSubCommand);
                newCommand.options.push(newGroup);
            } else {
                newCommand.options = newCommand.options.filter((opt) => opt.name !== this.subcommand.name);
                newSubCommand.description = this.description;
                newCommand.options.push(newSubCommand);
            }
            updateCommand(this.$store.state.token, this.$store.state.proxyURL, this.$store.getters.applicationID, this.$store.state.selectedGuildID, newCommand).then(() => {
                this.$store.dispatch('updateCommand', newCommand);
                this.updateSubCommandLoading = false;
            });
        },
        deleteSubCommand () {
            this.updateSubCommandLoading = true;
            const newCommand = this.command;
            if (this.subgroup) {
                newCommand.options = newCommand.options.filter((opt) => opt.name !== this.subgroup.name);
                const newGroup = this.subgroup;
                newGroup.options = newCommand.options.filter((opt) => opt.name !== this.subcommand.name);
                newCommand.options.push(newGroup);
            } else {
                newCommand.options = newCommand.options.filter((opt) => opt.name !== this.subcommand.name);
            }
            updateCommand(this.$store.state.token, this.$store.state.proxyURL, this.$store.getters.applicationID, this.$store.state.selectedGuildID, newCommand).then(() => {
                this.$store.dispatch('updateCommand', newCommand);
                this.updateSubCommandLoading = false;
                this.$router.push(`/command/${this.command.id}${this.subgroup ? `group-${this.subgroup.name}/` : ''}cmd-${this.subcommand.name}`);
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
