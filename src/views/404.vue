<template>
    <div class="text-center mt-28">
        <h1 class="mb-4 text-2xl text-discord font-bold">
            404 - Page Not Found
        </h1>
        You seem lost... Go back to the <router-link
            to="/"
            tag="a"
            class="hover:underline text-discord"
        >
            home page
        </router-link> to start exploring Slash Commands of your bot!
    </div>
</template>

<script>
export default {
    name: '404'
};
</script>
