<template>
    <div class="px-4 my-12 space-y-6">
        <h1 class="text-center text-2xl md:text-3xl">
            Configuration of /{{ command.name }}
        </h1>
        <div class="max-w-3xl mx-auto">
            <h1 class="text-1xl">
                Actions
            </h1>
            <button>Delete</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SlashCommand',
    computed: {
        command () {
            return this.$store.state.commands.find((cmd) => cmd.id === this.$route.params.commandID)
        }
    }
}
</script>
