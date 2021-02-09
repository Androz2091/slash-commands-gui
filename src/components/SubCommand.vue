<template>
    <div
        class="cmd-card focus:outline-none ml-4 mr-4 md:ml-0 md:mr-0 mt-2 text-gray-500 rounded-2xl bg-darktwo cursor-pointer"
        tabindex="0"
        :onclick="open"
        @keyup.enter="open"
    >
        <p class="inline">
            /{{ command.name }} {{ subcommandgroup ? subcommandgroup.name : '' }}
        </p> <p class="text-discord inline">
            {{ subcommand.name }}
        </p>
    </div>
</template>

<script>
export default {
    name: 'SlashCommand',
    props: {
        command: {
            type: Object,
            required: true
        },
        subcommandgroup: {
            type: Object,
            required: false,
            default: null
        },
        subcommand: {
            type: Object,
            required: true
        }
    },
    methods: {
        open () {
            this.$router.push(`/command/${this.command.id}/${this.subcommandgroup ? `groups/${this.subcommandgroup.name}/` : ''}subs/${this.subcommand.name}`);
        }
    }
};
</script>

<style scoped>
.cmd-card {
    padding: 20px;
    border-width: 2px;
    border-color: transparent;
}
.cmd-card:focus {
    border-color: white;
}
.cmd-card:hover {
    border-color: white;
}
</style>
