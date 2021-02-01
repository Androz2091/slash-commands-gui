<template>
    <div
        class="cmd-card"
        tabindex="1"
        :onclick="test"
        @keyup.enter="test"
    >
        /coucou
    </div>
</template>

<script>
export default {
    name: 'SlashCommand',
    methods: {
        test () {
            alert('coucou')
        }
    }
}
</script>

<style >
.cmd-card {
    background-color: #202225;
    max-width: 200px;
    padding: 20px;
    border-radius: 25px;
    cursor: pointer;
    border-color: white;
}
.cmd-card:hover {
    text-decoration: underline;
}
</style>
