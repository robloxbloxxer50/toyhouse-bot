//replyHandler.js
//The script that handles replying to slash commands.
//Also handles some console output.

const { MessageEmbed } = require("discord.js")
const errorColor = "#ff0000"
const successColor = "#00ff00"

//HELP EMBED
const info = (user) => {
    return new MessageEmbed()
        .setTitle("Info Menu/Command List")
        .setDescription("Welcome to the info menu! This menu shows every command that you can run for this bot, along with some other stuff.")
        .addField("/createcharacter", "Creates a character with a name and a description.")
        .addField("/editcharacter", "Allows you to edit a characters name, description and/or image.")
        .addField("/deletecharacter", "Deletes a character that has the given name.")
        .addField("/viewcharacter", "Views a character owned by the user given")
        .addField("/listcharacters", "Lists all your character's by names only.")
        .addField("__Other Stuff__", "**GitHub Page:**\nhttps://github.com/robloxbloxxer50/roleplay-bot\n\n**Private Characters**\nPrivate Characters are characters that only you can use /viewcharacter on and only come up in a character list when you run /listcharacters.")
        .setColor("ffff00")
        .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))
}

//Function to make footer text cuz im lazy
function footerText(user) {
    return "Bot made by Bloxxer#8729"
}

//Mongo disconnect log
const mongoDisconnect = (user, userid, guild, guildid) => {
    console.log("------------------------------\nDisconnected from Mongo:\n>>user.tag: " + user + " (" + userid + ")\n>>Guild: " + guild + " (" + guildid + ")\n------------------------------")
}

//Mongo connect log
const mongoConnect = (user, userid, guild, guildid) => {
    console.log("------------------------------\nConnected to Mongo:\n>>User: " + user + " (" + userid + ")\n>>Guild: " + guild + " (" + guildid + ")\n------------------------------")
}

//Mongo error log
const mongoError = (user, userid, guild, guildid, err) => {
    console.warn("------------------------------\nMongo Error:\n>>User: " + user + " (" + userid + ")\n>>Guild: " + guild + " (" + guildid + ")\n>>Error: " + err + "\n------------------------------")
}

//Mongo Error Reply
const mongoErrorReply = (user, err) => {
    return new MessageEmbed()
        .setTitle("A MongoDB Error Occured!")
        .setDescription("Please send this to Bloxxer#8729:\n```js\n" + err + "\n```")
        .setColor(errorColor)
        .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))
}

//Character Already Exists
const characterExists = (charName, user) => {
    return new MessageEmbed()
        .setTitle("Character Already Exists!")
        .setDescription("The character named **" + charName + "** already exists!")
        .setColor(errorColor)
        .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))
}

//Character Doesnt Exist
const characterDoesntExist = (charName, user) => {
    return new MessageEmbed()
        .setTitle("Character Doesn't Exist!")
        .setDescription("Could not find the character named **" + charName + "** in the bot's database. Please make a character with this name first. If you believe this is a glitch/error, please contact Bloxxer#8729.")
        .setColor(errorColor)
        .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))
}


//Successfully Created Character
const characterCreated = (charName, user) => {
    return new MessageEmbed()
        .setTitle("Character Successfully Created!")
        .setDescription("Your character **" + charName + "** has been successfully saved in the database.")
        .setColor(successColor)
        .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))
}

//Error in Creating Character
const characterCreateError = (charName, user, err) => {
    return new MessageEmbed()
        .setTitle("Character Creation Error!")
        .setDescription("An error has occured trying to create the character named **" + charName + "**. Please send this error to Bloxxer#8729:\n```js\n" + err + "\n```")
        .setColor(errorColor)
        .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))
}

//Successfully Modified Character
const characterModified = (charName, user) => {
    return new MessageEmbed()
        .setTitle("Character Successfully Modified!")
        .setDescription("Your character **" + charName + "** has been successfuly updated!")
        .setColor(successColor)
        .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))
}

//Error in Modifying Character
const characterModifyError = (charName, user, err) => {
    return new MessageEmbed()
        .setTitle("Character Modification Error!")
        .setDescription("An error has occured trying to modify the character named **" + charName + "**. Please send this error to Bloxxer#8729:\n```js\n" + err + "\n```")
        .setColor(errorColor)
        .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))
}

//Successfully Deleted Character
const characterDeleted = (charName, user) => {
    return new MessageEmbed()
        .setTitle("Character Successfuly Deleted!")
        .setDescription("Your character **" + charName + "** was successfully removed from the database.")
        .setColor(successColor)
        .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))
}

//Error in Deleting Character
const characterDeleteError = (charName, user, err) => {
    return new MessageEmbed()
        .setTitle("Character Deletion Error!")
        .setDescription("There was an error while trying to delete your character named **" + charName + "**. Please send this error to Bloxxer#8729:\n```js\n" + err + "\n```")
        .setColor(errorColor)
        .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))
}

//View Character output
const viewCharacter = (charName, charDesc, charImg, color, user) => {
    if (charImg) {
        return new MessageEmbed()
            .setTitle(charName)
            .setDescription(charDesc)
            .setImage(charImg)
            .setColor(color)
            .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))
    } else {
        return new MessageEmbed()
            .setTitle(charName)
            .setDescription(charDesc)
            .setColor(color)
            .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))
    }
}

//View Character Error
const viewCharacterError = (charName, user, err) => {
    return new MessageEmbed()
        .setTitle("Error in Viewing Character!")
        .setDescription("There was an error while trying to view the character named **" + charName + "**. Please send this error to Bloxxer#8729:\n```js\n" + err + "\n```")
        .setColor(errorColor)
        .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))
}

//List Character Output
const listCharacters = (array, user, showPrivate) => {
    var embed = new MessageEmbed()
        .setTitle("Character List")
        .setColor(successColor)
        .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))

    for (var att in array) {
        //Handling private characters.
        if (array[att].isPrivate && user.id != array[att].ownerId) {
            if (!array[att].isPrivate) {
                var i = array[att].img
                if (!i) {
                    i = "None"
                }
                embed.addField(array[att].name, "Color: " + array[att].color + "\nImage URL: " + i + "\nPrivate: " + array[att].isPrivate)
            }
        } else if (array[att].isPrivate && user.id == array[att].ownerId && showPrivate) {
            var i = array[att].img
            if (!i) {
                i = "None"
            }
            embed.addField(array[att].name, "Color: " + array[att].color + "\nImage URL: " + i + "\nPrivate: " + array[att].isPrivate)
        } else if (array[att].isPrivate && user.id == array[att].ownerId && !showPrivate) {
            if (!array[att].isPrivate) {
                var i = array[att].img
                if (!i) {
                    i = "None"
                }
                embed.addField(array[att].name, "Color: " + array[att].color + "\nImage URL: " + i + "\nPrivate: " + array[att].isPrivate)
            }
        } else if (!array[att].isPrivate) {
            var i = array[att].img
            if (!i) {
                i = "None"
            }
            embed.addField(array[att].name, "Color: " + array[att].color + "\nImage URL: " + i + "\nPrivate: " + array[att].isPrivate)
        }
    }
    return embed
}

//List Character Error
const listCharacterError = (user, err) => {
    return new MessageEmbed()
        .setTitle("Error in Listing Characters!")
        .setDescription("There was an error while trying to list your characters. If there is an error below, please send it to Bloxxer#8729:\n```js\n" + err + "\n```")
        .setColor(errorColor)
        .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))
}

//No Characters Exist
const noCharacters = (user) => {
    return new MessageEmbed()
        .setTitle("You or the selected user doesn't have any characters!")
        .setDescription("You/this person doesn't have any characters yet! Make some with ``/makecharacter``! If you believe this is an error, please send a DM to Bloxxer#8729.")
        .setColor(errorColor)
        .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))
}

//Access Denied to Private Character
const characterIsPrivate = (charName, user) => {
    return new MessageEmbed()
        .setTitle("This character is private.")
        .setDescription("The character **" + charName + "** is a private character that is not owned by you. Please ask the owner of this character to run the same command. If you believe this is an error, please DM Bloxxer#8729.")
        .setColor(errorColor)
        .setFooter(footerText(user.tag), user.avatarURL({ dynamic: true }))
}


//Exporting functions
exports.info = info
exports.mongoDisconnect = mongoDisconnect
exports.mongoConnect = mongoConnect
exports.mongoError = mongoError
exports.mongoErrorReply = mongoErrorReply
exports.characterExists = characterExists
exports.characterDoesntExist = characterDoesntExist
exports.characterCreated = characterCreated
exports.characterCreateError = characterCreateError
exports.characterModified = characterModified
exports.characterModifyError = characterModifyError
exports.characterDeleted = characterDeleted
exports.characterDeleteError = characterDeleteError
exports.viewCharacter = viewCharacter
exports.viewCharacterError = viewCharacterError
exports.listCharacters = listCharacters
exports.listCharacterError = listCharacterError
exports.noCharacters = noCharacters
exports.characterIsPrivate = characterIsPrivate