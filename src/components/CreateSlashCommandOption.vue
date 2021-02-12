<template>
    <div
        class="cmd-card focus:outline-none ml-4 mr-4 md:ml-0 md:mr-0 mt-2 rounded-2xl bg-darkthree cursor-pointer"
        tabindex="0"
        @click="$emit('submit')"
        @keyup.enter="$emit('submit')"
    >
        Create a new parameter
    </div>
</template>

<script>
export default {
    name: 'CreateSlashCommandOption',
    emits: ['submit']
};
</script>

<style scoped>
.cmd-card {
    padding: 20px;
    border-width: 2px;
    border-color: transparent;
}
.cmd-card:focus {
    border-color: #7289DA;
}
.cmd-card:hover {
    border-color: #7289DA;
}
</style>
