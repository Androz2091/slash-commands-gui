<template>
    <div
        class="card bg-darktwo"
        tabindex="0"
        @click="open"
        @keyup.enter="open"
    >
        <p class="inline">
            /{{ command.name }}
        </p> <p class="inline text-discord mr-1">
            {{ subcommandgroup.name }}
        </p>
        <p
            v-for="(subcommand, index) in subcommandgroup.options"
            :key="subcommand.name"
            class="inline"
        >
            {{ index === 0 ? '(' : '' }} {{ subcommand.name }} {{ index+1 === subcommandgroup.options.length ? ')' : '/' }}
        </p>
        <div class="float-right">
            <p class="inline text-center text-gray-400">
                {{ subcommandgroup.description }}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SlashCommand',
    components: {
    },
    props: {
        command: {
            type: Object,
            required: true
        },
        subcommandgroup: {
            type: Object,
            required: true
        }
    },
    methods: {
        open () {
            this.$router.push(`/command/${this.command.id}/groups/${this.subcommandgroup.name}`);
        }
    }
};
</script>

