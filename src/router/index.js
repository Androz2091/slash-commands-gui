import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import Settings from "../views/Settings.vue";
import SlashCommand from "../views/SlashCommand.vue";
import SubCommandGroup from "../views/SubCommandGroup.vue";
import SubCommand from "../views/SubCommand.vue";
import NotFound from "../views/404.vue";

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
    },
    {
        path: "/command/:commandID/subs/:commandName",
        name: "SubCommand",
        component: SubCommand
    },
    {
        path: "/command/:commandID/groups/:groupName",
        name: "SubGroup",
        component: SubCommandGroup
    },
    {
        path: "/command/:commandID/groups/:groupName/subs/:commandName",
        name: "SubCommandInGroup",
        component: SubCommand
    },
    {
        path: "/:pathMatch(.*)*",
        name: "404",
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
