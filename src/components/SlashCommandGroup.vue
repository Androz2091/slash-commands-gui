<template>
    <li>
        <div
            class="els  grid grid-cols-3 gap-4"
            :class="{bold: isFolder}"
            @click="toggle"
            @dblclick="makeFolder"
        >
            <div>
                {{ item.name }}
            </div>
            <div class="italic">
                {{ item.description }}
            </div>
        </div>
        <ul v-if="item.subcommands && item.subcommands.length > 0">
            <SlashCommand
                v-for="(child, index) in item.subcommands"
                :key="index"
                class="item"
                :item="child"
                @make-folder="$emit('make-folder', $event)"
                @add-item="$emit('add-item', $event)"
            />
        </ul>
    </li>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
    name: 'SlashCommandGroup',
    components: {
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    emits: ['make-folder'],
    computed: {
        isFolder () {
            return this.item.children && this.item.children.length;
        }
    },
    beforeCreate () {
        this.$options.components.SlashCommand = defineAsyncComponent(() => import('./SlashCommand.vue'))
    },
    methods: {
        makeFolder: function() {
            if (!this.isFolder) {
                this.$emit("make-folder", this.item);
                this.isOpen = true;
            }
        }
    }
}
</script>

<style>
</style>
