<template>
    <NavigationBar />
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
    <RouterView />
</template>

<script>
import NavigationBar from './components/NavigationBar.vue'
import HelloWorld from './components/HelloWorld.vue'

export default {
    name: 'App',
    components: {
        HelloWorld,
        NavigationBar
    }
}
</script>
