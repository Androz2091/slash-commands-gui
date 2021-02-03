<template>
    <div
        class="opt-card focus:outline-none focus:border-white mt-2"
        tabindex="0"
        :onclick="open"
        @keyup.enter="open"
    >
        {{ option.name }}
        <br>
        <small class="text-gray-400">{{ option.description }}</small>
        <SlashLabel
            :content="type.name"
            :color="type.color"
        />
    </div>
</template>

<script>
import dataTypes from '../util/data-types';
import SlashLabel from './SlashLabel.vue';

export default {
    name: 'SlashCommandOption',
    components: {
        SlashLabel
    },
    props: {
        option: {
            type: Object,
            required: true
        }
    },
    computed: {
        type () {
            return dataTypes.find((t) => t.type === this.option.type);
        }
    },
    methods: {
        open () {
        }
    }
};
</script>

<style scoped>
.opt-card {
    background-color: #202225;
    padding: 20px;
    border-radius: 25px;
    cursor: pointer;
    border-width: 1px;
    border-color: transparent;
}
.opt-card:focus {
    border-color: white;
}
.opt-card:hover {
    border-color: white;
}
</style>
