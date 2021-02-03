<template>
    <span
        class="text-xs font-semibold inline-block py-1 px-2 rounded-full uppercase last:mr-0 mr-1 ml-2"
        :class="labelClass"
    >
        {{ content }}
    </span>
</template>

<script>
export default {
    name: 'Label',
    props: {
        content: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: false,
            default: 'pink'
        }
    },
    computed: {
        labelClass () {
            return `bg-${this.color}-200 text-${this.color}-600`;
        }
    }
};
</script>