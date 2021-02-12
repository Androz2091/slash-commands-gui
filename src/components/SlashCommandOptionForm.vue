<template>
    <Modal
        :open="open"
        :title="action + ' the option'"
        @close="closeModal"
    >
        <div class="space-y-6 mb-4">
            <SelectForm
                :default="type"
                :options="options"
                @update="newTypeSelectUpdate"
            />
            <div class="space-y-2">
                <label for="optionname">Option Name</label>
                <input
                    v-model="name"
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
                    v-model="description"
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
                v-if="type === 'String'"
                class="space-y-2"
            >
                <label for="optiondesc">Choices</label>
                <div
                    v-if="choices[0] !== ''"
                    style="margin-bottom: 15px;"
                >
                    <div
                        v-for="choice in choices"
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
                    placeholder="available choices (separated by a comma)"
                >
                <span
                    v-if="maxChoicesReached"
                    class="text-red-400"
                >
                    You can only add 10 choices!
                </span>
                <span
                    v-if="emptyChoice"
                    class="text-red-400"
                >
                    You can't add an empty choice!
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
                        {{ action }}
                    </div>
                </button>
            </div>
        </template>
    </Modal>
</template>

<script>
import { formatString } from '../util/helpers';
import Modal from './Modal.vue';
import SelectForm from './SelectForm.vue';
import dataTypes from '../util/data-types';
import LoadingAnimation from './LoadingAnimation.vue';

export default {
    name: 'SlashCommandOptionForm',
    components: {
        Modal,
        SelectForm,
        LoadingAnimation
    },
    props: {
        option: {
            type: Object,
            required: false,
            default: null
        },
        action: {
            type: String,
            required: true
        },
        open: {
            type: Boolean,
            required: true
        },
        resetOnSubmit: {
            type: Boolean,
            required: true
        },
        modalLoading: {
            type: Boolean,
            required: true
        }
    },
    emits: ['submit', 'close'],
    data () {
        return {
            name: '',
            description: '',
            type: '',
            rawChoices: '',

            maxChoicesReached: false,
            emptyChoice: false,
            choiceInputAutoTrigger: false
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
        options () {
            return dataTypes.map((t) => t.name).map((name) => formatString(name));
        },
        choices () {
            return this.rawChoices.split(',');
        }
    },
    watch: {
        rawChoices () {
            const maxChoicesReached = this.choices.length > 10;
            const emptyChoice = this.choices.filter((c) => !c).length > 1;
            if (maxChoicesReached || emptyChoice) {
                this.rawChoices = this.rawChoices.substr(0, this.rawChoices.length - 1);
                if (maxChoicesReached) this.maxChoicesReached = true;
                else if (emptyChoice) this.emptyChoice = true;
                this.choiceInputAutoTrigger = true;
            } else if (!this.choiceInputAutoTrigger) {
                this.maxChoicesReached = false;
                this.emptyChoice = false;
            } else {
                this.choiceInputAutoTrigger = false;
            }
        }
    },
    mounted () {
        if (this.option) {
            this.name = this.option.name;
            this.description = this.option.description;
            this.rawChoices = this.option.choices?.map((c) => c.name).join(',') || '';
            this.type = formatString(dataTypes.find((t) => t.type === this.option.type).name);
        }
    },
    methods: {
        onSubmit () {
            this.$emit('submit', {
                name: this.name,
                description: this.description,
                type: this.type,
                rawChoices: this.rawChoices
            });
        },
        closeModal () {
            this.$emit('close');
        },
        newTypeSelectUpdate (newValue) {
            this.type = newValue;
        }
    }
};
</script>