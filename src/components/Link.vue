<template>
    <router-link
        tag="a"
        :to="to"
        class="hover:underline"
        :class="color ? 'text-discord' : ''"
    >
        {{ content }}
    </router-link>
</template>

<script>
export default {
    name: 'Link',
    props: {
        to: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        color: {
            type: Boolean,
            required: false,
            default: true
        }
    }
};
</script>
