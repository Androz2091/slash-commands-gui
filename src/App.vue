<template>
    <NavigationBar />
    <RouterView />
</template>

<script>
import NavigationBar from './components/NavigationBar.vue'

export default {
    name: 'App',
    components: {
        NavigationBar
    },
    beforeCreate () {
        this.$store.dispatch('loadSettingsCache');
    }
}
</script>