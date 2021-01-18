<template>
    <h1 class="text-center text-3xl p-10">
        Global Commands
    </h1>
    <div class="container mx-auto">
        <SlashCommand
            v-for="command in commands"
            :key="command.name"
            class="top-level-cmd"
            :item="command"
            @make-folder="makeFolder"
            @add-item="addItem"
        />
    </div>
</template>

<script>
import SlashCommand from '../components/SlashCommand.vue'

export default {
    components: {
        SlashCommand,
    },
    emits: ['add-item'],
    data() {
        return {
            commands: [
                {
                    name: 'ping',
                    description: 'Get the bot\'s ping!',
                    options: [],
                    subgroups: [
                        {
                            name: 'user',
                            description: 'Edit/Display user permissions',
                            subcommands: [
                                {
                                    name: 'get',
                                    description: 'Get user permissions',
                                    options: [
                                        {
                                            name: 'user',
                                            description: 'The user to get',
                                            type: 'USER'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'permissions',
                    description: 'Edit/Display user permissions',
                    subgroups: [
                        {
                            name: 'user',
                            description: 'Edit/Display user permissions',
                            subcommands: [
                                {
                                    name: 'get',
                                    description: 'Get user permissions',
                                    options: [
                                        {
                                            name: 'user',
                                            description: 'The user to get',
                                            type: 'USER'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'avatar',
                    description: 'Get user avatar',
                    options: [
                        {
                            name: 'big',
                            description: 'Should the avatar be big?',
                            type: 'STRING'
                        }
                    ]
                }
            ]
        }
    },
    methods: {
        makeFolder: function(item) {
            item.children = [];
            this.addItem(item);
        },
        addItem: function(item) {
            item.children.push({
                name: "new stuff"
            });
        }
    }
}
</script>

<style>
.top-level-cmd {
    margin-bottom: 100px;
}
</style>
