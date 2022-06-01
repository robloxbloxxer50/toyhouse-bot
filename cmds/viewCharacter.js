//View Character Command
//Command used to create characters in the DB.

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

const viewCharacter = {
  type: "slash",
  name: "viewcharacter",
  description: "Views a users character.",
  options: [
    {
      name: "name",
      description: "The name of the character.",
      type: "STRING",
      required: true
    },
    {
      name: "user",
      description: "The user that owns the character. Leave blank to set to yourself.",
      type: "USER",
      required: false
    },
  ],

  async execute({ interaction }) {
    //Interaction name and user variables
    var iname = await interaction.options.getString("name")
    var character
    var owner

    if (interaction.options.getUser("user") == null) {
      owner = interaction.user
    } else {
      owner = interaction.options.getUser("user")
    }

    await connectToDB(false, interaction)
    bioDB = mongoClient.db("rpBios").collection("savedBios")

    //Checking if the user has a character with the given name
    if (await bioDB.findOne({ name: iname, ownerId: owner.id }) == null) {
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

    character = await bioDB.findOne({ name: iname, ownerId: owner.id })

    if (character.isPrivate == true && interaction.user.id != character.ownerId) {
      interaction.reply(
        {
          embeds:
            [
              reply.characterIsPrivate(iname, interaction.user)
            ]
        }
      )

      connectToDB(true, interaction)
      return
    }

    //Viewing and outputting the character.
    try {
      const character = await bioDB.findOne({
        name: interaction.options.getString("name"),
        ownerId: owner.id,
      })

      if (character.img) {
        interaction.reply(
          {
            embeds: [
              reply.viewCharacter(character.name, character.description, character.img, character.color, interaction.user)
            ]
          }
        )
      } else {
        interaction.reply(
          {
            embeds: [
              reply.viewCharacter(character.name, character.description, false, character.color, interaction.user)
            ]
          }
        )
      }
    } catch (err) {
      interaction.reply(
        {
          embeds:
            [
              interaction.reply(
                {
                  embeds:
                    [
                      reply.viewCharacterError(iname, interaction.user, err)
                    ]
                }
              )
            ]
        }
      )
      connectToDB(true, interaction)
      return
    }
    connectToDB(true, interaction)
  }
}

exports.cmd = viewCharacter