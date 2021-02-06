<template>
    <h1 class="text-center text-3xl p-10">
        Slash Commands
    </h1>
    <div class="container md:mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <CreateSlashCommand />
            <SlashCommand
                v-for="command in $store.state.commands"
                :key="command.name"
                :command="command"
            />
        </div>
    </div>
</template>

<script>
import SlashCommand from '../components/SlashCommand.vue';
import CreateSlashCommand from '../components/CreateSlashCommand.vue';

export default {
    components: {
        SlashCommand,
        CreateSlashCommand
    }
};
</script>
