import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import Settings from "../views/Settings.vue";
import SlashCommand from "../views/SlashCommand.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/settings",
        name: "Settings",
        component: Settings
    },
    {
        path: "/command/:commandID",
        name: "Command",
        component: SlashCommand
    }
];

const router = createRouter({
    history: createWebHistory('/slash-commands-gui/'),
    routes,
});

export default router;
