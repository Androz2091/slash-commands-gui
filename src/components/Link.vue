<template>
    <router-link
        v-if="router"
        tag="a"
        :to="to"
        class="hover:underline"
        :class="color ? 'text-discord' : ''"
    >
        {{ content }}
    </router-link>
    <a
        v-else
        :href="to"
        class="hover:underline"
        :class="color ? 'text-discord' : ''"
        target="_blank"
    >{{ content }}</a>
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
    },
    computed: {
        router () {
            return !this.to.startsWith('http');
        }
    }
};
</script>
