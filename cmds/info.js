//Info Command
//Lists all of the bot's commands, along with other helpful information.
const reply = require("./replyHandler.js")

const info = {
  type: "slash",
  name: "info",
  description: "Shows all of the commands for this bot, along with some other things.",

  async execute({ interaction }) {
    interaction.reply(
      {
        embeds:
          [
            reply.info(interaction.user)
          ]
      }
    )
  }
}

exports.cmd = info