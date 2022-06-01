//Make Character Command
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

const createCharacter = {
  type: "slash",
  name: "makecharacter",
  description: "Creates a character in the bot's database with a given name.",
  options: [
    {
      name: "name",
      description: "The name to give the character",
      type: "STRING",
      required: true
    },
    {
      name: "description",
      description: "The description of the character.",
      type: "STRING",
      required: true
    },
    {
      name: "private",
      description: "Makes the character private. Run /info for more info.",
      type: "BOOLEAN",
      required: true
    },
    {
      name: "color",
      description: "The color of the embed (HEX ONLY, Google \"color picker\").",
      type: "STRING",
      required: false
    },
    {
      name: "image",
      description: "A image that represents your character.",
      type: "STRING",
      required: false
    }
  ],

  async execute({ interaction }) {
    //Interaction name variable
    var iname = interaction.options.getString("name")
    var isPrivate = interaction.options.getBoolean("private")
    var img
    var color


    await connectToDB(false, interaction)
    bioDB = mongoClient.db("rpBios").collection("savedBios")

    //Finding possible existing files with the same name
    if (await bioDB.findOne({ name: iname, ownerId: interaction.user.id }) !== null) {
      interaction.reply(
        {
          embeds:
            [
              reply.characterExists(iname, interaction.user)
            ]
        }
      )

      connectToDB(true, interaction)
      return
    }

    //Setting the image URL (if it exists)
    if (interaction.options.getString("image") !== null) {
      img = interaction.options.getString("image")
    } else {
      img = false
    }

    //Setting the color
    if (interaction.options.getString("color") !== null) {
      color = interaction.options.getString("color")
    } else {
      color = "#ffff00"
    }

    //Creating a new file
    try {
      await bioDB.insertOne({
        name: interaction.options.getString("name"),
        ownerId: interaction.member.user.id,
        description: interaction.options.getString("description"),
        color: color,
        img: img,
        isPrivate: isPrivate
      })
    } catch (err) {
      interaction.reply(
        {
          embeds:
            [
              reply.characterCreateError(iname, interaction.user, err)
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
            reply.characterCreated(iname, interaction.user)
          ]
      }
    )
    connectToDB(true, interaction)
  }
}

exports.cmd = createCharacter