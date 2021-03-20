<template>
    <div class="px-4 my-12 space-y-10">
        <h1 class="text-center text-2xl md:text-3xl font-semibold">
            Configuration of /{{ command.name }}
        </h1>
        <UpdateForm
            ref="updateForm"
            type="Command"
            :description="command.description"
            @update="updateCommand"
            @delete="deleteCommand"
        />
        <div
            v-if="subcommands.length > 0 || params.length === 0"
            class="max-w-3xl mx-auto bg-darkone py-4 px-4 rounded"
        >
            <h1 class="text-2xl my-4">
                Subcommands
            </h1>
            <SubCommand
                v-for="subcommand in subcommands"
                :key="subcommand.name"
                :subcommand="subcommand"
                :command="command"
            />
            <div v-if="params.length === 0">
                <CreateSubCommand />
            </div>
        </div>
        <div
            v-if="subcommandgroups.length > 0 || params.length === 0"
            class="max-w-3xl mx-auto bg-darkone py-4 px-4 rounded"
        >
            <h1 class="text-2xl my-4">
                Subcommand Groups
            </h1>
            <SubCommandGroup
                v-for="subcommandgroup in subcommandgroups"
                :key="subcommandgroup.name"
                :subcommandgroup="subcommandgroup"
                :command="command"
            />
            <div v-if="params.length === 0">
                <CreateSubGroup />
            </div>
        </div>
        <div
            v-if="subcommandgroups.length === 0 && subcommands.length === 0"
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
            <div>
                <SlashCommandOptionForm
                    action="Create"
                    :open="createFormOpen"
                    :modal-loading="modalLoading"
                    @close="closeModal"
                    @submit="createCommandOption"
                    @delete="deleteCommandOption"
                />
                <CreateSlashCommandOption
                    @submit="createFormOpen = true;"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { deleteCommand, updateCommand } from '../api';
import SlashCommandOption from '../components/SlashCommandOption.vue';
import SubCommand from '../components/SubCommand.vue';
import SubCommandGroup from '../components/SubCommandGroup.vue';
import UpdateForm from '../components/UpdateForm.vue';
import { cloneObject } from '../util/helpers';
import CreateSubCommand from '../components/CreateSubCommand.vue';
import CreateSubGroup from '../components/CreateSubGroup.vue';
import SlashCommandOptionForm from '../components/SlashCommandOptionForm.vue';
import CreateSlashCommandOption from '../components/CreateSlashCommandOption.vue';

export default {
    name: 'SlashCommand',
    components: {
        SlashCommandOption,
        SubCommand,
        SubCommandGroup,
        UpdateForm,
        CreateSubCommand,
        CreateSubGroup,
        SlashCommandOptionForm,
        CreateSlashCommandOption
    },
    data () {
        return {
            createFormOpen: false,
            modalLoading: false
        };
    },
    computed: {
        params () {
            return (this.command.options || []).filter((o) => o.type > 2);
        },
        subcommands () {
            return (this.command.options || []).filter((o) => o.type === 1);
        },
        subcommandgroups () {
            return (this.command.options || []).filter((o) => o.type === 2);
        },
        updateCommandButtonClass () {
            return this.updateCommandLoading ? 'inline-flex items-center cursor-not-allowed' : '';
        },
        deleteCommandButtonClass () {
            return this.deleteCommandLoading ? 'inline-flex items-center cursor-not-allowed' : '';
        },
        command () {
            return this.$store.state.commands.find((cmd) => cmd.id === this.$route.params.commandID);
        }
    },
    methods: {
        updateCommand (description) {
            this.$refs.updateForm.setUpdateLoading(true);
            const newCommand = cloneObject(this.command);
            newCommand.description = description;
            updateCommand(this.$store.state.clientID, this.$store.state.token.value, this.$store.state.selectedGuildID, newCommand).then(() => {
                this.$store.dispatch('updateCommand', newCommand);
                this.$refs.updateForm.setUpdateLoading(false);
            });
        },
        deleteCommand () {
            this.$refs.updateForm.setDeleteLoading(true);
            deleteCommand(this.$store.state.clientID, this.$store.state.token.value, this.$store.state.selectedGuildID, this.command.id).then(() => {
                this.$store.dispatch('deleteCommand', this.command.id);
                this.$refs.updateForm.setDeleteLoading(false);
                this.$router.push('/');
            });
        },
        closeModal () {
            this.createFormOpen = false;
        },
        createCommandOption (optionData) {
            this.modalLoading = true;
            if (!this.command.options) this.command.options = [];
            this.command.options.push(optionData);
            updateCommand(this.$store.state.clientID, this.$store.state.token.value, this.$store.state.selectedGuildID, this.command).then(() => {
                this.$store.dispatch('updateCommand', this.command);
                this.closeModal();
                this.modalLoading = false;
                this.name = '';
                this.description = '';
            });
        }
    }
};
</script>
