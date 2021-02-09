<template>
    <Modal
        :open="modalOpen"
        title="Update the option"
        @close="closeModal"
    >
        <div class="space-y-6 mb-4">
            <SelectForm
                :default="typeName"
                :options="options"
            />
            <div class="space-y-2">
                <label for="clientid">Command Name</label>
                <input
                    v-model="name"
                    class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                    name="clientid"
                >
                <span
                    v-if="commandExists"
                    class="text-red-400"
                >
                    There is already a command with that name!
                </span>
                <span
                    v-if="incorrectName"
                    class="text-red-400"
                >
                    The command name length should be between 3 and 32 character!
                </span>
            </div>
            <div class="space-y-2">
                <label for="clientid">Command Description</label>
                <input
                    v-model="description"
                    class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                    name="clientid"
                >
                <span
                    v-if="incorrectDescription"
                    class="text-red-400"
                >
                    The command description is required (max 100 character)!
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
                        Update
                    </div>
                </button>
            </div>
        </template>
    </Modal>
    <div
        class="opt-card focus:outline-none mt-2 rounded-2xl bg-darktwo cursor-pointer"
        tabindex="0"
        :onclick="openModal"
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
</template>

<script>
import { formatString } from '../util/helpers';
import dataTypes from '../util/data-types';
import SlashLabel from './SlashLabel.vue';
import Modal from './Modal.vue';
import SelectForm from './SelectForm.vue';

export default {
    name: 'SlashCommandOption',
    components: {
        SlashLabel,
        Modal,
        SelectForm
    },
    props: {
        option: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            modalOpen: false,
            modalLoading: false
        };
    },
    computed: {
        type () {
            return dataTypes.find((t) => t.type === this.option.type);
        },
        typeName () {
            return formatString(this.type.name);
        },
        options () {
            return dataTypes.map((t) => t.name).map((name) => formatString(name));
        }
    },
    methods: {
        openModal () {
            this.modalOpen = true;
        },
        closeModal () {
            this.modalOpen = false;
        }
    }
};
</script>

<style scoped>
.opt-card {
    padding: 20px;
    border-width: 2px;
    border-color: transparent;
}
.opt-card:focus {
    border-color: white;
}
.opt-card:hover {
    border-color: white;
}
</style>
