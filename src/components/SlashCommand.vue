<template>
    <div
        class="cmd-card focus:outline-none focus:border-white"
        tabindex="0"
        :onclick="test"
        @keyup.enter="test"
    >
        /coucou
    </div>
</template>

<script>
export default {
    name: 'SlashCommand',
    props: {
    },
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
}
.cmd-card:focus {
    border-width: 1px;
}
.cmd-card:hover {
    text-decoration: underline;
}
</style>
