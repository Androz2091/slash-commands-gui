<template>
    <div class="px-4 my-12 space-y-10">
        <h1 class="text-center text-2xl md:text-3xl font-semibold">
            Configuration of /{{ command.name }} {{ group.name }}
        </h1>
        <UpdateForm
            ref="updateForm"
            type="Group"
            :description="group.description"
            @update="updateGroup"
        />
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
            <CreateSubCommand />
        </div>
    </div>
</template>
        

<script>
import { updateCommand } from '../api';
import SubCommand from '../components/SubCommand.vue';
import { cloneObject } from '../util/helpers';
import UpdateForm from '../components/UpdateForm.vue';
import CreateSubCommand from '../components/CreateSubCommand.vue';

export default {
    name: 'SlashCommand',
    components: {
        SubCommand,
        UpdateForm,
        CreateSubCommand
    },
    computed: {
        subcommands () {
            return (this.command.options || []).filter((o) => o.type === 1);
        },
        incorrectDescription () {
            return !(this.description);
        },
        command () {
            return this.$store.state.commands.find((cmd) => cmd.id === this.$route.params.commandID);
        },
        group () {
            return this.command.options.find((opt) => opt.name === this.$route.params.groupName);
        }
    },
    methods: {
        updateGroup (description) {
            this.$refs.updateForm.setUpdateLoading(true);
            const newCommand = cloneObject(this.command);
            const newGroup = cloneObject(this.group);
            newCommand.options = newCommand.options.filter((opt) => opt.name !== this.group.name);
            newGroup.description = description;
            newCommand.options.push(newGroup);
            updateCommand(this.$store.state.clientID, this.$store.state.token.value, this.$store.state.proxyURL, this.$store.state.selectedGuildID, newCommand).then(() => {
                this.$store.dispatch('updateCommand', newCommand);
                this.$refs.updateForm.setUpdateLoading(false);
            });
        },
        deleteGroup () {
            this.$refs.updateForm.setDeleteLoading(true);
            const newCommand = this.command;
            newCommand.options = newCommand.options.filter((opt) => opt.name !== this.group.name);
            updateCommand(this.$store.state.clientID, this.$store.state.token.value, this.$store.state.proxyURL, this.$store.state.selectedGuildID, newCommand).then(() => {
                this.$store.dispatch('updateCommand', newCommand);
                this.$refs.updateForm.setDeleteLoading(false);
                this.$router.push(`/command/${this.command.id}/groups/${this.group.name}`);
            });
        }
    }
};
</script>
