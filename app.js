// importando o módulo express-handlebars
const { engine } = require("express-handlebars");
const file_upload = require("express-fileupload");
const express = require("express");
const mysql2 = require("mysql2");
const bcrypt = require("bcrypt");
const fs = require("fs");
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

    console.log("Banco conectado✅");
})

// página padrão
app.get("/", (req, res) => {
    res.render("login", { layout: "index" });
})

// rota registro
app.get("/register", (req, res) => {
    res.render("register", { layout: "index" });
})

// rota login
let active_user;
app.post("/login", (req, res)=>{
    const usuario = req.body.user;
    const senha = req.body.password;
    

    let sql = `SELECT userd, passwordd 
    FROM users WHERE userd = ?`;

    conexao.execute(sql, [usuario], (erro, retorno) => {
        if (erro) throw erro;

        const [rows] = retorno;
        const pass_true = bcrypt.compare(senha, rows.passwordd)
        if (pass_true)
        {
            console.log("Login permitido✅");
            active_user = usuario;
            res.redirect("/formulario");
        } else {
            console.log("Login inválido❌");
            res.send("<h2>Usuário ou senha inválidos! <a href='/'>Voltar</a></h2>");
        }
    });
})

app.post("/register", (req, res) => {
    const user = req.body.user_r;
    const password = req.body.password_r;
       
    conexao.execute(`SELECT COUNT(*) AS total FROM users WHERE UPPER(userd) = UPPER(?);`, [user], (erro, retorno) => {
        if (erro) throw erro;
        const [rows] = retorno;

        if (rows.total > 0)
        {
            return res.status(409).json({ erro: "Usuário existente" });
        }

        const hashed = 0;

        async ()=>{
            hashed = await bcrypt.hash(password, 10);
        }

        let sql =`INSERT INTO users (userd, passwordd) VALUES ( ?, ?);`;
    
        conexao.execute(sql, [user, hashed], (erro, retorno) => {
            if (erro) throw erro;
            console.log(retorno);
            res.redirect("/");
        })
    });
})


// rota para formulario
app.get("/formulario", (req, res) => {
    let sql = `
    SELECT 
        p.named,
        p.price,
        p.imaged,
        u.userd
    FROM products p
    JOIN users u ON u.cod = p.user_cod
    WHERE u.userd = ?;`;
    conexao.execute(sql, [active_user],(erro, retorno) => {
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

