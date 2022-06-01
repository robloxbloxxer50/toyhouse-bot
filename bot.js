require("dotenv").config()
const slasho = require("discord-slasho")
const { CommandInteraction } = require("discord.js")

//Command Handler Script
const cmds = require("./cmds/handler.js")


const bot = new slasho.App({
  token: process.env.DISCORD_TOKEN,
  devGuild: "714337883116535868",
  intents: ["GUILDS"],
  commands: [
    cmds.makechar,
    cmds.editchar,
    cmds.deletechar,
    cmds.viewchar,
    cmds.listchars,
    cmds.info,
    //cmds.test
  ]
})

bot.launch().then(() => {
  bot.production()
})