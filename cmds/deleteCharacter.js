//Delete Character Command
//Command used to delete characters in the DB.

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

const deleteCharacter = {
  type: "slash",
  name: "deletecharacter",
  description: "Deletes a user's character in the bot's database.",
  options: [
    {
      name: "name",
      description: "The name of the character you want to delete.",
      type: "STRING",
      required: true
    }
  ],

  async execute({ interaction }) {
    //Interaction name variable
    var iname = interaction.options.getString("name")

    await connectToDB(false, interaction)
    bioDB = mongoClient.db("rpBios").collection("savedBios")

    //Checking if character exists.
    if (await bioDB.findOne({ name: iname, ownerId: interaction.user.id }) == null) {
      interaction.reply(
        {
          embeds:
            [
              reply.characterDoesntExist(iname, interaction.user)
            ]
        }
      )

      connectToDB(true, interaction)
      return
    }



    //Deleting The Character
    try {
      await bioDB.deleteOne({
        name: interaction.options.getString("name")
      })
    } catch (err) {
      interaction.reply(
        {
          embeds:
            [
              reply.characterDeleteError(iname, interaction.user, err)
            ]
        }
      )
      connectToDB(true, interaction)
      return
    }
    interaction.reply(
      {
        embeds:
          [
            reply.characterDeleted(iname, interaction.user)
          ]
      }
    )
    connectToDB(true, interaction)
  }
}

exports.cmd = deleteCharacter