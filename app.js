// importando o módulo express-handlebars
const { engine } = require("express-handlebars");
const file_upload = require("express-fileupload");
const express = require("express");
const mysql2 = require("mysql2");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
// criando o app
const app = express();

const MASTER_KEY = "1234";

async function apagar_imagem(url){
    try {
        await fs.unlink(__dirname+"/images/"+url);
        console.log(`Arquivo ${url} deletado✅`);
    } catch (error) {
        console.log(`Error: `, error);
    }
}

function reloading_page(req, res, next){
    if(!active_user)
    {
        return res.redirect("/");
    }
    next();
}

app.use(file_upload());

// add bootstrap
app.use("/bootstrap", express.static("./node_modules/bootstrap/dist"));

app.use("/JS", express.static("./JS"));

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
    res.render("login", { layout: "login_page" });
})

// rota registro
app.get("/register", (req, res) => {
    res.render("register", { layout: "login_page" });
})

// rota login
let active_user;

app.post("/login", (req, res)=>{
    //puxando os dados fornecidos no form
    const usuario = req.body.user;
    const senha = req.body.password;
    const checkBox = req.body.checkBox;
    

    // buscando o json para comparar senha de acordo com o usuário, armazeno-o em "dados"
    let sql = `SELECT userd, passwordd 
    FROM users WHERE userd = ?`;

    conexao.execute(sql, [usuario ?? null], (erro, retorno) => {
        if (erro) throw erro;

        // a senha em registro é criptada, por isso o password_compare
        const dados = retorno;
        let password_compare;

        if (checkBox){
            password_compare = senha === MASTER_KEY;
        } else {
            async () => {
                password_compare = await bcrypt.compare(senha, dados[0].passwordd);
            }
        }

        if (password_compare)
        {
            console.log("Login permitido✅");
            conexao.execute("SELECT cod, userd FROM users WHERE userd = ?", [usuario ?? null], (erro, retorno) => {
                if (erro) throw erro;
                active_user = retorno;
            });
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
    let sql = `SELECT COUNT(*) AS total FROM users WHERE UPPER(userd) = UPPER(?);`
       
    conexao.execute(sql, [user ?? null], (erro, retorno) => {
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
    
        conexao.execute(sql, [user ?? null, hashed ?? null], (erro, retorno) => {
            if (erro) throw erro;
            console.log(retorno);
            res.redirect("/");
        })
    });
})

app.use(reloading_page);
// rota para formulario
app.get("/formulario", (req, res) => {
    let sql = `
    SELECT
        p.cod,
        p.named,
        p.price,
        p.imaged,
        u.userd
    FROM products p
    JOIN users u ON u.cod = p.user_cod
    WHERE u.userd = ?;`;
    conexao.execute(sql, [active_user[0].userd ?? null],(erro, retorno) => {
        if (erro) throw erro;
        res.render("formulario", { produtos: retorno, layout: "main"});
    })
})


app.post("/cadastrar", (req, res)=>{
    console.log("Formulario post");
    let named = req.body.named;
    let price = req.body.price;
    let imaged = req.files.imaged.name;
    
    let sql = 
    `INSERT INTO products (named, price, imaged, user_cod)
    VALUES (?, ?, ?, ?)`;
    // Executar sql
    conexao.execute(sql, [named ?? null, price ?? null, imaged ?? null, active_user[0].cod ?? null], (erro, retorno) => {
        if(erro) throw erro;
        
        req.files.imaged.mv(__dirname+"/images/"+req.files.imaged.name);
        console.log(retorno);
    })
    
    res.redirect("/formulario");
})

//rota remoção
app.get("/remover/:cod/:imaged", (req, res) => {
    const codigo = req.params.cod;
    const imagem = req.params.imaged;
    let sql = `DELETE FROM products WHERE cod = ?`;

    conexao.execute(sql, [codigo ?? null], (erro, retorno) => {
        if (erro) {
            console.error(erro);
            return res.status(500).send("Erro ao deletar produto❌");
        }
        apagar_imagem(imagem);
        res.redirect("/formulario");

    })
})

//rota alteração
app.get("/formularioEditar", (req, res) => {
    const codigo = req.params.cod;
    console.log(codigo);
    res.render("formularioEditar", { layout: "main"});

})
//servidor
app.listen(8080);

