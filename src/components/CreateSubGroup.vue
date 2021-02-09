<template>
    <Modal
        :open="modalOpen"
        title="Create a sub group"
        @close="closeModal"
    >
        <div class="space-y-6 mb-4">
            <div class="space-y-2">
                <label for="cmdname">Group Name</label>
                <input
                    v-model="name"
                    class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                    name="cmdname"
                >
                <span
                    v-if="groupExists"
                    class="text-red-400"
                >
                    There is already a group with that name!
                </span>
                <span
                    v-if="incorrectName"
                    class="text-red-400"
                >
                    The command name length should be between 3 and 32 character!
                </span>
            </div>
            <div class="space-y-2">
                <label for="cmddesc">Group Description</label>
                <input
                    v-model="description"
                    class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                    name="cmddesc"
                >
                <span
                    v-if="incorrectDescription"
                    class="text-red-400"
                >
                    The group description is required (max 100 character)!
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
        class="cmd-card focus:outline-none ml-4 mr-4 md:ml-0 md:mr-0 mt-2 rounded-2xl bg-darkthree cursor-pointer"
        tabindex="0"
        :onclick="openModal"
        @keyup.enter="openModal"
    >
        Create a new sub group
    </div>
</template>

<script>
import { updateCommand } from '../api';
import Modal from './Modal.vue';
import LoadingAnimation from './LoadingAnimation.vue';

export default {
    name: 'CreateSubGroup',
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
        groupExists () {
            return this.command.options?.some((opt) => opt.name === this.name);
        },
        incorrectName () {
            return !(this.name && this.name.length >= 3 && this.name.length <= 32);
        },
        incorrectDescription () {
            return !(this.description && this.description.length <= 100);
        },
        command () {
            return this.$store.state.commands.find((cmd) => cmd.id === this.$route.params.commandID);
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
            this.command.options.push({
                name: this.name,
                description: this.description,
                type: 2,
                options: []
            });
            updateCommand(this.$store.state.clientID, this.$store.state.token.value, this.$store.state.proxyURL, this.$store.state.selectedGuildID, this.command).then(() => {
                this.$store.dispatch('updateCommand', this.command);
                this.modalLoading = false;
                this.closeModal();
            });
        }
    }
};
</script>

<style scoped>
.cmd-card {
    padding: 20px;
    border-width: 2px;
    border-color: transparent;
}
.cmd-card:focus {
    border-color: #7289DA;
}
.cmd-card:hover {
    border-color: #7289DA;
}
</style>
