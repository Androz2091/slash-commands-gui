<template>
    <div
        class="card bg-darktwo"
        tabindex="0"
        @click="open"
        @keyup.enter="open"
    >
        <p class="inline">
            /{{ command.name }} {{ subcommandgroup ? subcommandgroup.name : '' }}
        </p> <p class="text-discord inline">
            {{ subcommand.name }}
        </p>
        <div class="float-right">
            <p class="inline text-center text-gray-400">
                {{ subcommand.description }}
            </p>
        </div>
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
