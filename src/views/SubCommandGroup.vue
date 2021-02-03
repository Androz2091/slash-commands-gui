<template>
    <div class="px-4 my-12 space-y-10">
        <h1 class="text-center text-2xl md:text-3xl font-semibold">
            Configuration of /{{ command.name }} {{ group.name }}
        </h1>
        <form
            class="max-w-3xl mx-auto bg-darkone py-4 px-4 rounded"
            @submit.prevent="updateGroup"
        >
            <h1 class="text-2xl my-4">
                Group Settings
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
                    Group description is required!
                </span>
            </div>
            <div>
                <!-- TODO: fix difference of height between both buttons when loading -->
                <button
                    type="submit"
                    class="bg-discord rounded py-2 px-4 focus:outline-none focus:border-white w-full md:w-auto"
                    :class="updateGroupButtonClass"
                    :disabled="updateGroupLoading"
                >
                    <svg
                        v-if="updateGroupLoading"
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
                    Update group
                </button>
                <button
                    class="bg-red-600 rounded py-2 px-4 focus:outline-none focus:border-white w-full my-1 md:my-0 md:w-auto md:mx-4"
                    :class="deleteGroupButtonClass"
                    :disabled="deleteGroupLoading"
                >
                    <svg
                        v-if="deleteGroupLoading"
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
                    Delete group
                </button>
            </div>
        </form>
        <div
            class="max-w-3xl mx-auto bg-darkone py-4 px-4 rounded"
        >
            <h1 class="text-2xl my-4">
                Subcommands
            </h1>
            <SubCommand
                v-for="subcommand in group.options"
                :key="subcommand.name"
                :subcommand="subcommand"
                :subcommandgroup="group"
                :command="command"
            />
        </div>
    </div>
</template>
        

<script>
import { updateCommand } from '../api';
import SubCommand from '../components/SubCommand.vue';
import { cloneObject } from '../util/helpers';

export default {
    name: 'SlashCommand',
    components: {
        SubCommand
    },
    data () {
        return {
            description: '',

            updateGroupLoading: false,
            deleteGroupLoading: false
        }
    },
    computed: {
        subcommands () {
            return (this.command.options || []).filter((o) => o.type === 1);
        },
        updateGroupButtonClass () {
            return this.updateGroupLoading ? 'inline-flex items-center cursor-not-allowed' : '';
        },
        deleteGroupButtonClass () {
            return this.deleteGroupLoading ? 'inline-flex items-center cursor-not-allowed' : '';
        },
        incorrectDescription () {
            return !(this.description);
        },
        command () {
            return this.$store.state.commands.find((cmd) => cmd.id === this.$route.params.commandID)
        },
        group () {
            return this.command.options.find((opt) => opt.name === this.$route.params.groupName);
        }
    },
    mounted () {
        this.description = this.group.description;
    },
    methods: {
        updateGroup () {
            this.updateGroupLoading = true;
            const newCommand = cloneObject(this.command);
            const newGroup = cloneObject(this.group);
            newCommand.options = newCommand.options.filter((opt) => opt.name !== this.group.name)
            newGroup.description = this.description;
            newCommand.options.push(newGroup);
            updateCommand(this.$store.state.token, this.$store.state.proxyURL, this.$store.getters.applicationID, this.$store.state.selectedGuildID, newCommand).then(() => {
                this.$store.dispatch('updateCommand', newCommand);
                this.updateGroupLoading = false;
            });
        },
        deleteGroup () {
            this.updateGroupLoading = true;
            const newCommand = this.command;
            newCommand.options = newCommand.options.filter((opt) => opt.name !== this.group.name)
            updateCommand(this.$store.state.token, this.$store.state.proxyURL, this.$store.getters.applicationID, this.$store.state.selectedGuildID, newCommand).then(() => {
                this.$store.dispatch('updateCommand', newCommand);
                this.updateGroupLoading = false;
                this.$router.push(`/command/${this.command.id}/group-${this.group.name}`);
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
