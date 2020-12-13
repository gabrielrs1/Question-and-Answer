const Sequelize = require("sequelize")

const connection = new Sequelize("guiaperguntas", "root", "zasdw", {
    host: "localhost",
    dialect: "mysql"
})

module.exports = connection