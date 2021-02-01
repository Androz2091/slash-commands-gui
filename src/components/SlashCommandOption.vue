<template>
    <div
        class="opt-card focus:outline-none focus:border-white"
        tabindex="0"
        :onclick="open"
        @keyup.enter="open"
    >
        {{ option.name }}
        <br>
        <small class="text-gray-400">{{ option.description }}</small>
        <span
            class="text-xs font-semibold inline-block py-1 px-2 rounded-full uppercase last:mr-0 mr-1 ml-2"
            :class="getSpanTypeClass"
        >
            {{ type.name }}
        </span>
    </div>
</template>

<script>
import dataTypes from '../util/data-types';

export default {
    name: 'SlashCommandOption',
    props: {
        option: {
            type: Object,
            required: true
        }
    },
    computed: {
        type () {
            return dataTypes.find((t) => t.type === this.option.type);
        },
        getSpanTypeClass () {
            const color = this.type.color;
            return `bg-${color}-200 text-${color}-600`;
        }
    },
    methods: {
        open () {
        }
    }
}
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
