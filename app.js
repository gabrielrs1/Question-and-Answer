const express = require("express")
const app = express()
const bodyParser = require("body-parser") // body-parser traduz os dados do formulário para uma estrutura javascript
const connection = require("./database/db")
const Pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")

// Database
connection
    .authenticate()
    .then(() => {
        console.log("database ok!")
    })
    .catch((error) => {
        console.log(error)
    })

app.set("view engine", "ejs") // renderiza o html na egine do ejs
app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended: false})) // body-parser
app.use(bodyParser.json())

app.get("/", (req, res) => {
    Pergunta.findAll({raw: true, order: [
        ["id","DESC"] // ASC = crescente | DESC = decrescente
    ]}).then(perguntas => { // Aqui equivale ao SELECT * FROM perguntas
        res.render("index", {
            perguntas: perguntas
        })
    })
})

app.get("/perguntar", (req, res) => {
    res.render("perguntar")
})

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    
    Pergunta.create({ // Aqui equivale ao INSERT INTO
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/")
    })
})

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined) {
            // pegando respostas
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [["id", "DESC"]]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
        } else {
            res.redirect("/")
        }
    })
})

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo
    var perguntaId = req.body.pergunta
    Resposta.create({ // Aqui equivale ao INSERT INTO
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect(`/pergunta/${perguntaId}`)
    })
})

app.listen(3000)