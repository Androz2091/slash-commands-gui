<template>
    <li>
        <div
            class="els"
            :class="{bold: isFolder}"
            @click="toggle"
            @dblclick="makeFolder"
        >
            {{ item.name }}
            <p class="italic">
                {{ item.description }}
            </p>
            <b>Option</b>
            <p>[New]</p>
        </div>
    </li>
</template>

<script>
export default {
    name: 'SlashCommandOption',
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
