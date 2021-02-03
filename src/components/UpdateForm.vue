<template>
    <form
        class="max-w-3xl mx-auto bg-darkone py-4 px-4 rounded"
        @submit.prevent="$emit('update', newDescription)"
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
                v-if="incorrectDescription"
                class="text-red-400"
            >
                {{ type }} description is required!
            </span>
        </div>
        <div>
            <!-- TODO: fix difference of height between both buttons when loading -->
            <button
                type="submit"
                class="bg-discord rounded py-2 px-4 focus:outline-none focus:border-white w-full md:w-auto"
                :class="updateButtonClass"
                :disabled="updateLoading"
            >
                <svg
                    v-if="updateLoading"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    />
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
                Update {{ type.toLowerCase() }}
            </button>
            <button
                class="bg-red-600 rounded py-2 px-4 focus:outline-none focus:border-white w-full my-1 md:my-0 md:w-auto md:mx-4"
                :class="deleteButtonClass"
                :disabled="deleteLoading"
            >
                <svg
                    v-if="deleteLoading"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    />
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
                Delete {{ type.toLowerCase() }}
            </button>
        </div>
    </form>
</template>

<script>
export default {
    name: 'UpdateForm',
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
    emits: ['update'],
    data () {
        return {
            newDescription: '',

            updateLoading: false,
            deleteLoading: false
        };
    },
    computed: {
        incorrectDescription () {
            return !(this.description);
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


<style scoped>
input {
    background-color: #373c42;
    width: 100%;
}
</style>
