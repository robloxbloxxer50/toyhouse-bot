//Character Edit Command
//Command used to modify character data.

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

const editCharacter = {
  type: "slash",
  name: "editcharacter",
  description: "Edit one of your characters!",
  options: [
    {
      name: "char_name",
      description: "Enter the name of the character you want to update",
      type: "STRING",
      required: true
    },
    {
      name: "new_char_name",
      description: "Enter the new name for the character here.",
      type: "STRING",
      required: false
    },
    {
      name: "new_char_desc",
      description: "Change the characters description.",
      type: "STRING",
      required: false
    },
    {
      name: "new_color",
      description: "Change the embed color (HEX ONLY, Google \"color picker\").",
      type: "STRING",
      required: false
    },
    {
      name: "new_char_image",
      description: "Change the characters image.",
      type: "STRING",
      required: false
    },
    {
      name: "private",
      description: "Change if the character is public or private",
      type: "BOOLEAN",
      required: false
    }
  ],

  async execute({ interaction }) {
    const characterName = interaction.options.getString("char_name")
    var newCharName = interaction.options.getString("new_char_name")
    var newCharDesc = interaction.options.getString("new_char_desc")
    var newColor = interaction.options.getString("new_color")
    var newCharImg = interaction.options.getString("new_char_image")
    var isPrivate = interaction.options.getBoolean("private")

    await connectToDB(false, interaction)

    //Detecting if a file with the character name exists
    if (await bioDB.findOne({ name: characterName, ownerId: interaction.user.id }) == null) {
      interaction.reply(
        {
          embeds:
            [
              reply.characterDoesntExist(characterName, interaction.user)
            ]
        }
      )
      connectToDB(true, interaction)
      return
    }

    //Checking for conflicting names in the DB
    if (newCharName !== null && await bioDB.findOne({ name: newCharName, ownerId: interaction.user.id })) {
      interaction.reply(
        {
          embeds: [
            reply.characterExists(newCharName, interaction.user)
          ]
        }
      )
      connectToDB(true, interaction)
      return
    }

    //Update variables if no input was given
    if (newCharName == null) {
      var x = await bioDB.findOne({ name: characterName, ownerId: interaction.user.id })
      newCharName = x.name
    }
    if (newCharDesc == null) {
      var x = await bioDB.findOne({ name: characterName, ownerId: interaction.user.id })
      newCharDesc = x.description
    }
    if (newColor == null) {
      var x = await bioDB.findOne({ name: characterName, ownerId: interaction.user.id })
      newColor = x.color
    }
    if (newCharImg == null) {
      var x = await bioDB.findOne({ name: characterName, ownerId: interaction.user.id })
      newCharImg = x.img
    }
    if (isPrivate == null) {
      var x = await bioDB.findOne({ name: characterName, ownerId: interaction.user.id })
      isPrivate = x.isPrivate
    }

    //Appending character file on MongoDB
    try {
      await bioDB.findOneAndUpdate(
        { name: characterName, ownerId: interaction.user.id, },
        { $set: { name: newCharName, description: newCharDesc, color: newColor, img: newCharImg, isPrivate: isPrivate } },
        { upsert: true }
      )
      interaction.reply(
        {
          embeds:
            [
              reply.characterModified(characterName, interaction.user)
            ]
        }
      )
    } catch (err) {
      interaction.reply(
        {
          embeds:
            [
              reply.characterModifyError(characterName, interaction.user, err)
            ]
        }
      )
      connectToDB(true, interaction)
      return
    }
  }
}

exports.cmd = editCharacter