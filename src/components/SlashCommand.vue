<template>
    <div
        class="cmd-card focus:outline-none focus:border-white ml-4 mr-4 md:ml-0 md:mr-0 rounded-2xl bg-darktwo cursor-pointer"
        tabindex="0"
        :onclick="open"
        @keyup.enter="open"
    >
        /{{ command.name }}
        <p class="text-gray-400">
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

<style scoped>
.cmd-card {
    padding: 20px;
    border-width: 1px;
    border-color: transparent;
}
.cmd-card:focus {
    border-color: white;
}
.cmd-card:hover {
    border-color: white;
}
</style>
