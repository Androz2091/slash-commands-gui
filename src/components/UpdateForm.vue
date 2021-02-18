<template>
    <div
        class="max-w-3xl mx-auto bg-darkone py-4 px-4 rounded"
    >
        <h1 class="text-2xl my-4">
            {{ type }} Settings
        </h1>
        <div class="space-y-2 my-4">
            <label for="description">Description</label>
            <input
                v-model="newDescription"
                class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                name="description"
            >
            <span
                v-if="descriptionInputError"
                class="text-red-400"
            >
                {{ descriptionInputError }}
            </span>
        </div>
        <div>
            <button
                type="submit"
                class="bg-discord rounded py-2 px-4 focus:outline-none focus:border-white w-full md:w-auto"
                :class="updateButtonClass"
                :disabled="updateLoading || descriptionInputError"
                @click="$emit('update', newDescription)"
            >
                <LoadingAnimation
                    v-if="updateLoading"
                    class="ml-auto mr-auto"
                />
                <div v-else>
                    Update {{ type.toLowerCase() }}
                </div>
            </button>
            <button
                class="bg-red-600 rounded py-2 px-4 focus:outline-none focus:border-white w-full my-1 md:my-0 md:w-auto md:mx-4"
                :class="deleteButtonClass"
                :disabled="deleteLoading"
                @click="$emit('delete')"
            >
                <LoadingAnimation
                    v-if="deleteLoading"
                    class="ml-auto mr-auto"
                />
                <div v-else>
                    Delete {{ type.toLowerCase() }}
                </div>
            </button>
        </div>
    </div>
</template>

<script>
import LoadingAnimation from './LoadingAnimation.vue';

export default {
    name: 'UpdateForm',
    components: {
        LoadingAnimation
    },
    props: {
        type: {
            type: String,
            required: false,
            default: 'command'
        },
        description: {
            type: String,
            required: true
        }
    },
    emits: ['update', 'delete'],
    data () {
        return {
            newDescription: '',

            updateLoading: false,
            deleteLoading: false
        };
    },
    computed: {
        descriptionInputError () {
            const descriptionEmpty = this.newDescription.length === 0;
            if (descriptionEmpty) return `The ${this.type.toLowerCase()} description is required!`;
            const descriptionMaxLength = this.newDescription.length > 100;
            if (descriptionMaxLength) return 'The ${this.type.toLowerCase()} description can not be longer than 100 characters.';
            return null;
        },
        updateButtonClass () {
            return this.updateLoading ? 'inline-flex items-center cursor-not-allowed' : '';
        },
        deleteButtonClass () {
            return this.deleteLoading ? 'inline-flex items-center cursor-not-allowed' : '';
        },
    },
    created () {
        this.newDescription = this.description;
    },
    methods: {
        setUpdateLoading (enabled) {
            this.updateLoading = enabled;
        },
        setDeleteLoading (enabled) {
            this.deleteLoading = enabled;
        }
    }
};
</script>
