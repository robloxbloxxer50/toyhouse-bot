//handler.js
//Main handler for exporting commands for use in the main bot script.

exports.makechar = require("./makeCharacter.js").cmd
exports.editchar = require("./editCharacter.js").cmd
exports.deletechar = require("./deleteCharacter.js").cmd
exports.viewchar = require("./viewCharacter.js").cmd
exports.listchars = require("./listCharacters.js").cmd
exports.info = require("./info.js").cmd

exports.test = require("./test.js").cmd