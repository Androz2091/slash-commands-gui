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
                @update="newTypeSelectUpdate"
            />
            <div class="space-y-2">
                <label for="optionname">Option Name</label>
                <input
                    v-model="newName"
                    class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                    name="optionname"
                >
                <span
                    v-if="paramExists"
                    class="text-red-400"
                >
                    There is already a parameter with that name!
                </span>
                <span
                    v-if="incorrectName"
                    class="text-red-400"
                >
                    The parameter name length should be between 3 and 32 character!
                </span>
            </div>
            <div class="space-y-2">
                <label for="optiondesc">Option Description</label>
                <input
                    v-model="newDescription"
                    class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                    name="optiondesc"
                >
                <span
                    v-if="incorrectDescription"
                    class="text-red-400"
                >
                    The parameter description is required (max 100 character)!
                </span>
            </div>
            <div
                v-if="newType === 'String'"
                class="space-y-2"
            >
                <label for="optiondesc">Choices</label>
                <div
                    v-if="newChoices[0] !== ''"
                    style="margin-bottom: 15px;"
                >
                    <div
                        v-for="choice in newChoices"
                        :key="choice"
                        class="bg-darkthree rounded p-2 mr-2 inline-block mb-2"
                        style="max-width: 150px"
                    >
                        {{ choice }}
                    </div>
                </div>
                <input
                    v-model="rawChoices"
                    class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                >
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
import LoadingAnimation from './LoadingAnimation.vue';

export default {
    name: 'SlashCommandOption',
    components: {
        SlashLabel,
        Modal,
        SelectForm,
        LoadingAnimation
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
            modalLoading: false,

            newName: this.option.name,
            newDescription: this.option.description,
            newType: '',
            rawChoices: ''
        };
    },
    computed: {
        incorrectName () {
            return false; // TODO: add this check
        },
        incorrectDescription () {
            return false; // TODO: add this check
        },
        paramExists () {
            return false; // TODO: add this check
        },
        type () {
            return dataTypes.find((t) => t.type === this.option.type);
        },
        typeName () {
            return formatString(this.type.name);
        },
        options () {
            return dataTypes.map((t) => t.name).map((name) => formatString(name));
        },
        newChoices () {
            return this.rawChoices.split(',');
        }
    },
    mounted () {
        this.newType = this.typeName;
        this.rawChoices = this.option.choices.map((c) => c.name).join(',');
    },
    methods: {
        openModal () {
            this.modalOpen = true;
        },
        closeModal () {
            this.modalOpen = false;
        },
        newTypeSelectUpdate (newValue) {
            this.newType = newValue;
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
