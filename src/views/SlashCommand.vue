<template>
    <div class="text-center px-4 my-12 mx-auto">
        <h1 class="text-1xl md:text-3xl">
            Configuration of /{{ command.name }}
        </h1>
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
