<template>
    <Modal
        :open="modalOpen"
        title="Create a command"
        @close="closeModal"
    >
        <div class="space-y-6 mb-4">
            <div class="space-y-2">
                <label for="cmdname">Command Name</label>
                <input
                    v-model="name"
                    class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                    name="cmdname"
                >
                <span
                    v-if="commandNameInputError"
                    class="text-red-400"
                >
                    {{ commandNameInputError }}
                </span>
            </div>
            <div class="space-y-2">
                <label for="cmddesc">Command Description</label>
                <input
                    v-model="description"
                    class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                    name="cmddesc"
                >
                <span
                    v-if="commandDescriptionInputError"
                    class="text-red-400"
                >
                    {{ commandDescriptionInputError }}
                </span>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-end pt-2">
                <button
                    class="px-4 bg-transparent p-3 rounded text-discord hover:text-discord mr-2 hover:underline focus:outline-none"
                    @click="closeModal"
                >
                    Cancel
                </button>
                <button
                    class="px-4 bg-discord p-3 rounded text-white hover:bg-discord focus:outline-none leading-none"
                    :disabled="modalLoading || commandNameInputError || commandDescriptionInputError"
                    @click="onSubmit"
                >
                    <div v-if="modalLoading">
                        <LoadingAnimation v-if="modalLoading" />
                    </div>
                    <div v-else>
                        Create
                    </div>
                </button>
            </div>
        </template>
    </Modal>
    <div
        class="card cmd-card bg-darkthree"
        tabindex="0"
        @click="openModal"
        @keyup.enter="openModal"
    >
        Create a new command
        <p class="text-gray-400">
            Click here to create a new command
        </p>
    </div>
</template>

<script>
import { createCommand } from '../api';
import Modal from './Modal.vue';
import LoadingAnimation from './LoadingAnimation.vue';

export default {
    name: 'CreateSlashCommand',
    components: {
        Modal,
        LoadingAnimation
    },
    emits: ['load-commands'],
    data () {
        return {
            name: '',
            description: '',
            modalLoading: false,
            modalOpen: false
        };
    },
    computed: {
        commandNameInputError () {
            const commandNameEmpty = this.name.length === 0;
            if (commandNameEmpty) return 'Name is required!';
            const commandExists = this.$store.state.commands.some((cmd) => cmd.name === this.name);
            if (commandExists) return 'There is already a command with that name!';
            const commandNameMinLength = this.name.length < 3;
            if (commandNameMinLength) return 'Name can not be shorter than 3 characters.';
            const commandNameMaxLength = this.name.length > 32;
            if (commandNameMaxLength) return 'Name can not be longer than 32 characters.';
            const invalidCharacters = !(/^[0-9a-zA-Z_]+$/.test(this.name));
            const isUpperCase = (string) => /^[A-Z]*$/.test(string)
            if (isUpperCase(this.name)) return 'Name can not contain uppercase letters!'
            if (invalidCharacters) return 'Name contains invalid characters.';
            return null;
        },
        commandDescriptionInputError () {
            const commandDescriptionEmpty = this.name.length === 0;
            if (commandDescriptionEmpty) return 'Description is required!';
            const commandDescriptionMaxLength = this.name.length > 100;
            if (commandDescriptionMaxLength) return 'Description can not be longer than 100 characters.';
            return null;
        }
    },
    methods: {
        openModal () {
            this.modalOpen = true;
        },
        closeModal () {
            this.modalOpen = false;
        },
        onSubmit () {
            this.modalLoading = true;
            this.closeModal();
            createCommand(this.$store.state.clientID, this.$store.state.token.value, this.$store.state.selectedGuildID, {
                name: this.name,
                description: this.description,
                options: []
            }).then(() => {
                this.$root.loadCommands();
                this.modalLoading = false;
                this.closeModal();
                this.name = '';
                this.description = '';
            });
        }
    }
};
</script>
