<template>
    <div
        class="sub-cmd-group-card focus:outline-none focus:border-white ml-4 mr-4 md:ml-0 md:mr-0 mt-2 text-gray-500"
        tabindex="0"
        :onclick="open"
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
            this.$router.push(`/command/${this.command.id}/group-${this.subcommandgroup.name}`);
        }
    }
};
</script>

<style scoped>
.sub-cmd-group-card {
    background-color: #202225;
    /* max-width: 200px; */
    padding: 20px;
    border-radius: 25px;
    cursor: pointer;
    border-width: 1px;
    border-color: transparent;
}
.sub-cmd-group-card:focus {
    border-color: white;
}
.sub-cmd-group-card:hover {
    border-color: white;
}
</style>
