<template>
    <div
        class="card bg-darktwo"
        tabindex="0"
        @click="openModal"
        @keyup.enter="openModal"
    >
        {{ option.name }}
        <br>
        <small class="text-gray-400">{{ option.description }}</small>
        <SlashLabel
            :content="type.name"
            :color="type.color"
        />
    </div>
    <SlashCommandOptionForm
        :open="updateFormOpen"
        :reset-on-submit="false"
        action="Update"
        :modal-loading="modalLoading"
        :delete-modal-loading="deleteModalLoading"
        :option="option"
        @close="closeModal"
        @submit="updateCommandOption"
        @delete="deleteCommandOption"
    />
</template>

<script>
import { updateCommand } from '../api';
import { cloneObject } from '../util/helpers';
import dataTypes from '../util/data-types';
import SlashLabel from './SlashLabel.vue';
import SlashCommandOptionForm from './SlashCommandOptionForm.vue';

export default {
    name: 'SlashCommandOption',
    components: {
        SlashLabel,
        SlashCommandOptionForm
    },
    props: {
        option: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            updateFormOpen: false,
            modalLoading: false,
            deleteModalLoading: false
        };
    },
    computed: {
        type () {
            return dataTypes.find((t) => t.type === this.option.type);
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
        openModal () {
            this.updateFormOpen = true;
        },
        closeModal () {
            this.updateFormOpen = false;
        },
        deleteCommandOption () {
            this.deleteModalLoading = true;
            const newCommand = cloneObject(this.command);
            const newSubCommand = this.subcommand ? cloneObject(this.subcommand) : null;
            if (!newSubCommand.options) newSubCommand.options = [];
            newSubCommand.options = newSubCommand.options.filter((opt) => opt.name !== this.option.name);
            if (this.subgroup) {
                const newGroup = cloneObject(this.subgroup);
                newCommand.options = newCommand.options.filter((opt) => opt.name !== this.subgroup.name);
                newGroup.options = newGroup.options.filter((opt) => opt.name !== this.subcommand.name);
                newGroup.options.push(newSubCommand);
                newCommand.options.push(newGroup);
            } else {
                newCommand.options = newCommand.options.filter((opt) => opt.name !== this.subcommand.name);
                newCommand.options.push(newSubCommand);
            }
            updateCommand(this.$store.state.clientID, this.$store.state.token.value, this.$store.state.selectedGuildID, newCommand).then(() => {
                this.$store.dispatch('updateCommand', newCommand);
                this.closeModal();
                this.deleteModalLoading = false;
            });
        },
        updateCommandOption (optionData) {
            this.modalLoading = true;
            const newCommand = cloneObject(this.command);
            const newSubCommand = this.subcommand ? cloneObject(this.subcommand) : null;
            if (this.subgroup) {
                const newGroup = cloneObject(this.subgroup);
                newCommand.options = newCommand.options.filter((opt) => opt.name !== this.subgroup.name);
                newGroup.options = newGroup.options.filter((opt) => opt.name !== this.subcommand.name);
                if (!newSubCommand.options) newSubCommand.options = [];
                newSubCommand.options = newSubCommand.options.filter((opt) => opt.name !== this.option.name);
                newSubCommand.options.push(optionData);
                newGroup.options.push(newSubCommand);
                newCommand.options.push(newGroup);
            } else if (this.subcommand) {
                newCommand.options = newCommand.options.filter((opt) => opt.name !== this.subcommand.name);
                if (!newSubCommand.options) newSubCommand.options = [];
                newSubCommand.options = newSubCommand.options.filter((opt) => opt.name !== this.option.name);
                newSubCommand.options.push(optionData);
                newCommand.options.push(newSubCommand);
            } else {
                newCommand.options = newCommand.options.filter((opt) => opt.name !== this.option.name);
                newCommand.options.push(optionData);
            }
            updateCommand(this.$store.state.clientID, this.$store.state.token.value, this.$store.state.selectedGuildID, newCommand).then(() => {
                this.$store.dispatch('updateCommand', newCommand);
                this.closeModal();
                this.modalLoading = false;
            });
        }
    }
};
</script>
