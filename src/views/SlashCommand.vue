<template>
    <div class="px-4 my-12 space-y-10">
        <h1 class="text-center text-2xl md:text-3xl font-semibold">
            Configuration of /{{ command.name }}
        </h1>
        <form class="max-w-3xl mx-auto bg-gray-700 py-4 px-4 rounded">
            <h1 class="text-2xl my-4">
                Command Settings
            </h1>
            <div class="space-y-2 my-4">
                <label for="description">Description</label>
                <input
                    v-model="description"
                    class="border block py-2 px-4 rounded focus:outline-none focus:border-discord"
                    name="description"
                >
                <span
                    v-if="incorrectDescription"
                    class="text-red-400"
                >
                    Command description is required!
                </span>
            </div>
            <div>
                <button
                    type="submit"
                    class="bg-discord rounded py-2 px-4 focus:outline-none focus:border-white w-full md:w-auto"
                >
                    Update command
                </button>
                <button
                    class="bg-red-600 rounded py-2 px-4 focus:outline-none focus:border-white w-full my-1 md:my-0 md:w-auto md:mx-4"
                >
                    Delete command
                </button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'SlashCommand',
    data () {
        return {
            description: ''
        }
    },
    computed: {
        incorrectDescription () {
            return !(this.description);
        },
        command () {
            return this.$store.state.commands.find((cmd) => cmd.id === this.$route.params.commandID)
        }
    },
    mounted () {
        this.description = this.command.description;
    }
}
</script>

<style scoped>
input {
    background-color: #373c42;
    width: 100%;
}

form {
    background-color: #292b2f;
}
</style>
