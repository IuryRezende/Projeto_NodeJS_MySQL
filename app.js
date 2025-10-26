// importando o módulo express-handlebars
const { engine } = require("express-handlebars");

// importando o módulo express
const express = require("express");

// importando o módulo mysql2
const mysql2 = require("mysql2");

// criando o app
const app = express();

// add bootstrap
app.use("/bootstrap", express.static("./node_modules/bootstrap/dist"));

app.use("/css", express.static("./css"));

//configuração do express-handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// criando conexão
const conexao = mysql2.createConnection({
    host:"localhost",
    user:"root",
    port: "3307",
    password:"Iuriza060423!",
    database: "projeto_node"
});

//Teste de Conexão
conexao.connect((erro)=>{
    if(erro) throw erro;

    console.log("Deu certo");
})


// rota para response hello world
app.get("/", function(req, res){
    res.render("formulario");

});

//servidor
app.listen(8080);

