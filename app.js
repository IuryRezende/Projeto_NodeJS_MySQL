// importando o módulo express-handlebars
const { engine } = require("express-handlebars");

const file_upload = require("express-fileupload");
// importando o módulo express
const express = require("express");

// importando o módulo mysql2
const mysql2 = require("mysql2");

// criando o app
const app = express();

app.use(file_upload());

// add bootstrap
app.use("/bootstrap", express.static("./node_modules/bootstrap/dist"));

app.use("/css", express.static("./css"));

app.use("/images", express.static("./images"));

//configuração do express-handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// criando conexão
const conexao = mysql2.createConnection({
    host:"localhost",
    user:"root",
    port: "3307",
    password: "Iuriza060423!",
    database: "projeto_node"
});

//Teste de Conexão
conexao.connect((erro)=>{
    if(erro) throw erro;

    console.log("Deu certo");
})

// página padrão
app.get("/", (req, res) => {
    res.render("index", { layout: "index" });
})

// rota registro
app.get("/register", (req, res) => {
    res.render("register", { layout: "index" });
})

// rota login
app.get("/login", (req, res) => {
    res.render("login", { layout: "index" });
})

app.post("/login", (req, res)=>{
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    if (usuario == "admin" && senha == "0604")
    {
        res.redirect("/formulario");
    } else {
        res.send("<h2>Usuário ou senha inválidos! <a href='/'>Voltar</a></h2>");
    }
})

app.post("/register", (req, res) => {
    const user = req.body.user_r;
    const password = req.body.password_r;

    let sql =`INSERT INTO users (userd, passwordd) VALUES ("${user}", "${password}")`;

    conexao.query(sql, (erro, retorno) => {
        if (erro) {
            return res.send(`
                <script>
                    alert("Fatal Error");
                    window.locale.href = "/";
                </script>
                `)
        };
        console.log("Deu certo");
        res.redirect("/login");
    })
})


// rota para formulario
app.get("/formulario", (req, res) => {
    let sql = `SELECT * FROM products`;
    conexao.query(sql, (erro, retorno) => {
        if (erro) throw erro;
        res.render("formulario", { produtos: retorno, layout: "main"});
    })
})


app.post("/formulario", (req, res)=>{
    let named = req.body.named;
    let price = req.body.price;
    let imaged = req.files.imaged.name;
    
    let sql = 
    `INSERT INTO products (named, price, imaged)
    VALUES ("${named}", ${price}, "${imaged}")`;
    
    // Executar sql
    conexao.query(sql, function(erro, retorno){
        if(erro) throw erro;
        
        req.files.imaged.mv(__dirname+"/images/"+req.files.imaged.name);
        console.log(retorno);
    })
    
    res.redirect("/formulario");
})
//servidor
app.listen(8080);

