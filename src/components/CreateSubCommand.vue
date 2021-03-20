<template>
    <Modal
        :open="modalOpen"
        title="Create a sub command"
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
                    v-if="nameInputError"
                    class="text-red-400"
                >
                    {{ nameInputError }}
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
                    v-if="descriptionInputError"
                    class="text-red-400"
                >
                    {{ descriptionInputError }}
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
                    :disabled="modalLoading || nameInputError || descriptionInputError"
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
        class="card bg-darkthree"
        tabindex="0"
        @click="openModal"
        @keyup.enter="openModal"
    >
        Create a new sub command
    </div>
</template>

<script>
import { updateCommand } from '../api';
import Modal from './Modal.vue';
import LoadingAnimation from './LoadingAnimation.vue';

export default {
    name: 'CreateSubCommand',
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
        nameInputError () {
            const nameEmpty = this.name.length === 0;
            if (nameEmpty) return 'The sub command name is required!';
            const commandExists = !this.modalLoading && (this.subgroup || this.command).options?.some((opt) => opt.name === this.name);
            if (commandExists) return 'There is already a sub command or a sub group with this name!';
            const nameMinLength = this.name.length < 3;
            if (nameMinLength) return 'The sub command name can not be shorter than 3 characters!';
            const nameMaxLength = this.name.length > 32;
            if (nameMaxLength) return 'The sub command name can not be longer than 32 characters!';
            const invalidCharacters = !(/^[0-9a-zA-Z_]+$/.test(this.name));
            if (invalidCharacters) return 'Name contains invalid characters.';
            return null;
        },
        descriptionInputError () {
            const descriptionEmpty = this.description.length === 0;
            if (descriptionEmpty) return 'The sub command description is required!';
            const descriptionMaxLength = this.description.length > 100;
            if (descriptionMaxLength) return 'The sub command description can not be longer than 100 characters!';
            return null;
        },
        command () {
            return this.$store.state.commands.find((cmd) => cmd.id === this.$route.params.commandID);
        },
        subgroup () {
            return this.$route.params.groupName ? this.command.options.find((opt) => opt.name === this.$route.params.groupName) : null;
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
            if (!this.command.options) this.command.options = [];
            if (this.subgroup) {
                if (!this.command.options.find((opt) => opt.name === this.subgroup.name).options) {
                    this.command.options.find((opt) => opt.name === this.subgroup.name).options = [];
                }
                this.command.options.find((opt) => opt.name === this.subgroup.name).options.push({
                    name: this.name,
                    description: this.description,
                    type: 1
                });
            } else {
                this.command.options.push({
                    name: this.name,
                    description: this.description,
                    type: 1
                });
            }
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
