<template>
    <h1 class="text-center text-3xl p-10">
        Slash Commands
    </h1>
    <div class="container md:mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
            <SlashCommand
                v-for="command in this.$store.state.commands"
                :key="command.name"
                :command="command"
            />
        </div>
    </div>
</template>

<script>
import SlashCommand from '../components/SlashCommand.vue';

export default {
    components: {
        SlashCommand
    }
};
</script>
