<template>
    <div
        class="card bg-darkthree"
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
