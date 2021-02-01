<template>
    <li>
        <div
            class="els grid grid-cols-3 gap-4"
            :class="{bold: isFolder}"
            @click="toggle"
            @dblclick="makeFolder"
        >
            <div class="cmd-name">
                /{{ item.name }}
            </div>
            <div class="italic">
                {{ item.description }}
            </div>
            <div class="flex">
                <span
                    v-tooltip="'Edit the command'"
                    class="cursor-pointer text-blue-500"
                    @click="editCommand"
                >
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    /></svg>
                </span>
                <span
                    v-tooltip="'Delete the command'"
                    class="cursor-pointer text-red-600 ml-2"
                    @click="deleteCommand"
                >
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    /></svg>
                </span>
                <span
                    class="cursor-pointer text-yellow-400 ml-2"
                    @click="addOption"
                >
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                    /></svg>
                </span>
                <span
                    class="cursor-pointer text-yellow-400 ml-2"
                    @click="addSubgroup"
                >
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    /></svg>
                </span>
            </div>
        </div>
        <ul v-if="item.subgroups && item.subgroups.length > 0">
            <SlashCommandGroup
                v-for="(child, index) in item.subgroups"
                :key="index"
                class="item"
                :item="child"
                @make-folder="$emit('make-folder', $event)"
                @add-item="$emit('add-item', $event)"
            />
        </ul>
        <ul v-if="item.options && item.options.length > 0">
            <SlashCommandOption
                v-for="(child, index) in item.options"
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
import SlashCommandGroup from './SlashCommandGroup.vue';
import SlashCommandOption from './SlashCommandOption.vue';

export default {
    name: 'SlashCommand',
    components: {
        SlashCommandGroup,
        SlashCommandOption
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
    methods: {
        makeFolder: function() {
            if (!this.isFolder) {
                this.$emit("make-folder", this.item);
                this.isOpen = true;
            }
        },
        editCommand () {
            alert('hello')
        },
        deleteCommand () {
            alert('delete')
        }
    }
}
</script>

<style>
li {
    list-style-type: none;
}
.els {
    background-color: #36393f;
    padding: 1rem;
    margin: 5px;
    border-radius: 25px;
    max-width: 1000px;
}
.cmd-name:hover {
    text-decoration: underline;
}
ul {
    padding-left: 0em;
    line-height: 1.5em;
    list-style-type: dot;
}
</style>
