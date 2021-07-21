<template>
    <div
        class="card cmd-card bg-darktwo"
        tabindex="0"
        @click="open"
        @keyup.enter="open"
    >
        /{{ command.name }}
        <p class="text-gray-400  overflow-ellipsis overflow-hidden whitespace-nowrap">
            {{ command.description }}
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
        }
    },
    methods: {
        open () {
            this.$router.push(`/command/${this.command.id}`);
        }
    }
};
</script>
