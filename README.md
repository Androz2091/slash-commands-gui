# [Slash Commands GUI](https://slash-commands-gui.netlify.app)

Graphical User Interface to explore Slash Commands of your bot, built on **[Vue 3](https://v3.vuejs.org/)** and **[TailwindCSS](https://tailwindcss.com/)** 🚀

## Features

The goal is to cover all the Discord Slash Commands API 🎯

### v0.0.1 - The beginning

* ~~Add a way to explore (read-only) slash commands of a bot~~
* ~~Add a way to explore (read-only) guild-specific slash commands of a bot~~
* ~~Add a way to specify a custom proxy URL~~
* ~~Add a way to explore sub commands and commands groups~~
* ~~Add a way to explore commands and sub commands parameters~~
* ~~Add a way to update commands, sub commands and commands groups descriptions~~
* ~~Add a way to delete commands, sub commands and commands groups~~

### v1.0.0 - Everything covered

* Add a way to create and update command parameters (change choices, name and type).
* Add a way to update command permissions once **[#2315](https://github.com/discord/discord-api-docs/issues/2315#issuecomment-761131184)** is closed.
* Add a way to create a new top-level command (name, description and permissions).
* Add a way to create a new commands group on a top-level command (name, description).
* Add a way to create a new sub command on a top-level command and on a group (name, description and permissions).

### v1.x.x - An Awesome tool

* Add a way to duplicate commands.
* Export commands to CURL (to create them on another guild for example).
* Generate a commands tree using canvas so we can easily see all the commands, their parameters, etc.

## Installation

* Clone the repository. (`git clone https://github.com/Androz2091/slash-commands-gui`)
* Install the dependencies. (`npm install` or `yarn install`)
* Start `vite` using `npm run dev` or `yarn dev`!

👋 Contributions to the project are appreciated so feel free to try to add cool stuff!

## CORS Proxy

Slash Commands GUI relies on a CORS proxy to make requests to the Discord API. This proxy is a simple [cors-anywhere proxy](https://github.com/Androz2091/androz2091-cors-anywhere). It is necessary because the Discord API does not send the CORS header.  
**Important note**: if you want to add an extra security level, you can host your own CORS proxy on your own machine. Press the **Settings** button during 3 seconds, and a new field will appear, allowing you to enter your proxy URL.
