
const test = {
  type: "slash",
  name: "test",
  description: "awooga",

  async execute({ interaction }) {
    interaction.reply("``" + interaction.user.avatarURL({ dynamic: true }) + "``")
  }
}

exports.cmd = test