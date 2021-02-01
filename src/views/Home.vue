<template>
    <h1 class="text-center text-3xl p-10">
        Global Commands
    </h1>
    <div class="container mx-auto">
        <SlashCommand />
    </div>
</template>

<script>
import SlashCommand from '../components/SlashCommand.vue'

export default {
    components: {
        SlashCommand
    },
    data() {
        return {}
    }
}
</script>

<style>
</style>
