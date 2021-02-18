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
                    v-if="nameInputError"
                    class="text-red-400"
                >
                    {{ nameInputError }}
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
                    v-if="descriptionInputError"
                    class="text-red-400"
                >
                    {{ descriptionInputError }}
                </span>
            </div>
            <div class="space-y-2">
                <label
                    for="toggle"
                >Required Option</label>
                <div
                    class="relative w-10 mr-2 align-middle select-none transition duration-200 ease-in"
                >
                    <input
                        id="toggle"
                        v-model="required"
                        type="checkbox"
                        name="toggle"
                        class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    >
                    <label
                        for="toggle"
                        class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    />
                </div>
            </div>
            <div
                v-if="type === 'String'"
                class="space-y-2"
            >
                <label class="block">Choices</label>
                <div
                    v-for="(choice, index) in choices"
                    :key="index"
                >
                    <input
                        v-model="choice.name"
                        placeholder="What the user will see"
                        class="border inline py-2 px-4 rounded focus:outline-none focus:border-discord mr-4 text-sm w-4/12 md:w-5/12"
                    >
                    <input
                        v-model="choice.value"
                        placeholder="The value sent to you"
                        class="border inline py-2 px-4 rounded focus:outline-none focus:border-discord text-sm w-4/12 md:w-5/12"
                    >
                    <svg
                        class="w-6 h-6 inline ml-4 pointer cursor-pointer"
                        fill="none"
                        stroke="#ff6666"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        @click="choices.splice(index, 1)"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    /></svg>
                </div>
                <button
                    class="bg-discord px-2 p-2 text-white rounded focus:outline-none text-sm"
                    :disabled="choices.length === 10"
                    @click="choices.push({ name: '', value: '' })"
                >
                    Add a new choice
                </button>
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
                    v-if="action === 'Update'"
                    class="px-4 bg-red-600 p-3 rounded text-white mr-4 focus:outline-none leading-none"
                    :disabled="deleteModalLoading || modalLoading"
                    @click="onDelete"
                >
                    <div v-if="deleteModalLoading">
                        <LoadingAnimation v-if="deleteModalLoading" />
                    </div>
                    <div v-else>
                        Delete
                    </div>
                </button>
                <button
                    class="px-4 bg-discord p-3 rounded text-white hover:bg-discord focus:outline-none leading-none"
                    :disabled="deleteModalLoading || modalLoading || nameInputError || descriptionInputError || (choices.some((c) => !c.name.length || !c.value.length))"
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
        },
        deleteModalLoading: {
            type: Boolean,
            required: true
        }
    },
    emits: ['submit', 'close', 'delete'],
    data () {
        return {
            name: '',
            description: '',
            type: 'String',
            choices: [],
            required: false,

            maxChoicesReached: false,
            emptyChoice: false,
            choiceInputAutoTrigger: false
        };
    },
    computed: {
        nameInputError () {
            const nameEmpty = this.name.length === 0;
            if (nameEmpty) return 'The option name is required!';
            const optionExists = this.action !== 'Update' && (this.subcommand || this.command).options?.some((opt) => opt.name === this.name);
            if (optionExists) return 'There is already an option with this name!';
            const nameMinLength = this.name.length < 3;
            if (nameMinLength) return 'The option name can not be shorter than 3 characters!';
            const nameMaxLength = this.name.length > 32;
            if (nameMaxLength) return 'The option name can not be longer than 32 characters!';
            return null;
        },
        descriptionInputError () {
            const descriptionEmpty = this.description.length === 0;
            if (descriptionEmpty) return 'The option description is required!';
            const descriptionMaxLength = this.description.length > 100;
            if (descriptionMaxLength) return 'The option description can not be longer than 100 characters.';
            return null;
        },
        options () {
            return dataTypes.map((t) => t.name).map((name) => formatString(name));
        },
        command () {
            return this.$store.state.commands.find((cmd) => cmd.id === this.$route.params.commandID);
        },
        subcommand () {
            return this.subgroup ? this.subgroup.options.find((opt) => opt.name === this.$route.params.commandName) : this.command.options?.find((opt) => opt.name === this.$route.params.commandName);
        },
        subgroup () {
            return this.$route.params.groupName ? this.command.options.find((opt) => opt.name === this.$route.params.groupName) : null;
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
            this.choices = this.option.choices || [];
            this.type = formatString(dataTypes.find((t) => t.type === this.option.type).name);
            this.required = this.option.required || false;
        }
    },
    methods: {
        onDelete () {
            this.$emit('delete', this.name);
        },
        onSubmit () {
            this.$emit('submit', {
                name: this.name,
                description: this.description,
                type: dataTypes.find((t) => formatString(t.name) === this.type).type,
                choices: this.type === 'String' ? this.choices : null,
                required: this.required
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