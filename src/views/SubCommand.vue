<template>
    <div class="px-4 my-12 space-y-10">
        <h1 class="text-center text-2xl md:text-3xl font-semibold">
            Configuration of /{{ command.name }} {{ subgroup ? subgroup.name : '' }} {{ subcommand.name }}
        </h1>
        <UpdateForm
            ref="updateForm"
            type="Command"
            :description="subcommand.description"
            @update="updateSubCommand"
            @delete="deleteSubCommand"
        />
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
import UpdateForm from '../components/UpdateForm.vue';
import { cloneObject } from '../util/helpers';

export default {
    name: 'SlashCommand',
    components: {
        SlashCommandOption,
        UpdateForm
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
    methods: {
        updateSubCommand (description) {
            this.$refs.updateForm.setUpdateLoading(true);
            const newCommand = cloneObject(this.command);
            const newSubCommand = cloneObject(this.subcommand);
            if (this.subgroup) {
                const newGroup = cloneObject(this.subgroup);
                newCommand.options = newCommand.options.filter((opt) => opt.name !== this.subgroup.name);
                newGroup.options = newGroup.options.filter((opt) => opt.name !== this.subcommand.name);
                newSubCommand.description = description;
                newGroup.options.push(newSubCommand);
                newCommand.options.push(newGroup);
            } else {
                newCommand.options = newCommand.options.filter((opt) => opt.name !== this.subcommand.name);
                newSubCommand.description = description;
                newCommand.options.push(newSubCommand);
            }
            updateCommand(this.$store.state.clientID, this.$store.state.token.value, this.$store.state.proxyURL, this.$store.state.selectedGuildID, newCommand).then(() => {
                this.$store.dispatch('updateCommand', newCommand);
                this.$refs.updateForm.setUpdateLoading(false);
            });
        },
        deleteSubCommand () {
            this.$refs.updateForm.setDeleteLoading(true);
            const newCommand = cloneObject(this.command);
            if (this.subgroup) {
                newCommand.options = newCommand.options.filter((opt) => opt.name !== this.subgroup.name);
                const newGroup = cloneObject(this.subgroup);
                newGroup.options = newCommand.options.filter((opt) => opt.name !== this.subcommand.name);
                newCommand.options.push(newGroup);
            } else {
                newCommand.options = newCommand.options.filter((opt) => opt.name !== this.subcommand.name);
            }
            updateCommand(this.$store.state.clientID, this.$store.state.token.value, this.$store.state.proxyURL, this.$store.state.selectedGuildID, newCommand).then(() => {
                this.$store.dispatch('updateCommand', newCommand);
                this.$refs.updateForm.setDeleteLoading(false);
                this.$router.push(`/command/${this.command.id}${this.subgroup ? `groups/${this.subgroup.name}/` : ''}`);
            });
        }
    }
};
</script>
