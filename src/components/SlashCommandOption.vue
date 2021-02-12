<template>
    <div
        class="opt-card focus:outline-none mt-2 rounded-2xl bg-darktwo cursor-pointer"
        tabindex="0"
        @click="openModal"
        @keyup.enter="openModal"
    >
        {{ option.name }}
        <br>
        <small class="text-gray-400">{{ option.description }}</small>
        <SlashLabel
            :content="type.name"
            :color="type.color"
        />
    </div>
    <SlashCommandOptionForm
        :open="updateFormOpen"
        :reset-on-submit="false"
        action="Update"
        :modal-loading="modalLoading"
        :option="option"
        @close="closeModal"
        @submit="updateCommandOption"
    />
</template>

<script>
import dataTypes from '../util/data-types';
import SlashLabel from './SlashLabel.vue';
import SlashCommandOptionForm from './SlashCommandOptionForm.vue';

export default {
    name: 'SlashCommandOption',
    components: {
        SlashLabel,
        SlashCommandOptionForm
    },
    props: {
        option: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            updateFormOpen: false,
            modalLoading: false
        };
    },
    computed: {
        type () {
            return dataTypes.find((t) => t.type === this.option.type);
        }
    },
    methods: {
        openModal () {
            this.updateFormOpen = true;
        },
        closeModal () {
            this.updateFormOpen = false;
        },
        updateCommandOption () {
            alert('updated');
        }
    }
};
</script>

<style scoped>
.opt-card {
    padding: 20px;
    border-width: 2px;
    border-color: transparent;
}
.opt-card:focus {
    border-color: white;
}
.opt-card:hover {
    border-color: white;
}
</style>
