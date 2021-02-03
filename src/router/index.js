import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import Settings from "../views/Settings.vue";
import SlashCommand from "../views/SlashCommand.vue";
import SubCommandGroup from "../views/SubCommandGroup.vue";
import SubCommand from "../views/SubCommand.vue";

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
        path: "/command/:commandID/cmd-:commandName",
        name: "SubCommand",
        component: SubCommand
    },
    {
        path: "/command/:commandID/group-:groupName",
        name: "SubGroup",
        component: SubCommandGroup
    },
    {
        path: "/command/:commandID/group-:groupName/cmd-:commandName",
        name: "SubCommand",
        component: SubCommand
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
