//Character List Command
//Command used to list the users characters.

require("dotenv").config()
const { MongoClient } = require("mongodb")
const reply = require("./replyHandler.js")
var mongoClient
var bioDB

//MongoDB Connection Function
async function connectToDB(closeConnection, interaction) {
  if (closeConnection == true) {
    await mongoClient.close()

    reply.mongoDisconnect(
      interaction.user.tag,
      interaction.user.id,
      interaction.guild.name,
      interaction.guild.id
    )

    return
  }

  try {
    mongoClient = new MongoClient(process.env.MONGO_URI)
    await mongoClient.connect()

    bioDB = mongoClient.db("rpBios").collection("savedBios")

    reply.mongoConnect(
      interaction.user.tag,
      interaction.user.id,
      interaction.guild.name,
      interaction.guild.id
    )
  } catch (err) {
    interaction.reply(
      {
        embeds:
          [
            reply.mongoErrorReply(interaction.user, err)
          ]
      }
    )

    reply.mongoError(
      interaction.user.tag,
      interaction.user.id,
      interaction.guild.name,
      interaction.guild.id,
      err
    )
  }
}

const listCharacters = {
  type: "slash",
  name: "listcharacters",
  description: "Lists your characters!",
  options: [
    {
      name: "user",
      description: "The user to pull up a character list for. Leave blank for yourself.",
      type: "USER",
      required: false
    },
    {
      name: "show_private",
      description: "Set to true to show private characters. Leave blank to set to false.",
      type: "BOOLEAN",
      required: false
    }
  ],

  async execute({ interaction }) {
    const user = interaction.options.getUser("user")
    const showPrivate = interaction.options.getBoolean("show_private")
    await connectToDB(false, interaction)
    var chars

    //Checking if the user declared a user or not
    if (user == null) {
      chars = await bioDB.find({
        ownerId: interaction.user.id
      }).toArray()
    } else {
      chars = await bioDB.find({
        ownerId: user.id
      }).toArray()
    }

    //Checking if the user has no chars
    if (JSON.stringify(chars) == "[]") {
      interaction.reply(
        {
          embeds:
            [
              reply.noCharacters(interaction.user)]
        }
      )
      await connectToDB(true, interaction)
      return
    }

    try {
      interaction.reply(
        {
          embeds:
            [
              await reply.listCharacters(chars, interaction.user, showPrivate)
            ]
        }
      )
    } catch (err) {
      interaction.reply(
        {
          embeds:
            [
              reply.listCharacterError(interaction.user, err)
            ]
        }
      )
      await connectToDB(true, interaction)
      return
    }
    await connectToDB(true, interaction)
  }
}

exports.cmd = listCharacters