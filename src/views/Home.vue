<template>
    <div class="text-center p-10">
        <h1 class="text-3xl mb-4">
            {{ $store.state.selectedGuildID ? `Slash Commands` : 'Global Slash Commands' }}
        </h1>
        You are currently managing the {{ !$store.state.selectedGuildID ? 'Global' : '' }} Slash Commands of <a
            class="link inline"
            target="_blank"
            :href="`https://discord.com/oauth2/authorize?client_id=${$store.state.clientID}&permissions=0&scope=bot%20applications.commands`"
        >
            {{ $store.state.applicationName }}
        </a> (<a
            class="link inline"
            @click="this.$root.loadCommands()"
        >
            refresh commands
        </a>)
        <div
            v-if="$store.state.selectedGuildID"
            class="inline"
        >
            on the guild <p class="link inline">
                {{ $store.state.selectedGuildID }}
            </p>
        </div>
    </div>
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
