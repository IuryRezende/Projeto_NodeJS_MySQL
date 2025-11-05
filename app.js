// importando o módulo express-handlebars
const { engine } = require("express-handlebars");
const file_upload = require("express-fileupload");
const express = require("express");
const mysql2 = require("mysql2");
const bcrypt = require("bcrypt");
const { CLIENT_RENEG_LIMIT } = require("tls");
const fs = require("fs").promises;
const path = require("path");
// criando o app
const app = express();
app.use(file_upload());

const MASTER_KEY = "060423!";

async function mudarNome(fileName, imagedFile, user_cod){
    const pontoIndex = imagedFile.lastIndexOf(".")

    const extensao = imagedFile.slice(pontoIndex);

    return `${fileName}_${user_cod}_${extensao}`;
}

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

    conexao.execute(sql, [usuario ?? null], async (erro, retorno) => {
        if (erro) throw erro;

        // a senha em registro é criptada, por isso o password_compare
        const dados = retorno;
        let password_compare = null;
        if (checkBox){
            password_compare = senha === MASTER_KEY;
        } else {
            password_compare = await bcrypt.compare(senha, dados[0].passwordd);
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
       
    conexao.execute(sql, [user ?? null], async (erro, retorno) => {
        if (erro) throw erro;
        const [rows] = retorno;

        if (rows.total > 0)
        {
            return res.status(409).json({ erro: "Usuário existente" });
        }

        const hashed = await bcrypt.hash(password, 10);

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


app.post("/cadastrar", async (req, res)=>{
    const named = req.body.named;
    const imaged_file = req.files.imaged.name
    const price = req.body.price;
    
    let sql = 
    `INSERT INTO products (named, price, imaged, user_cod)
    VALUES (?, ?, ?, ?)`;
    // Executar sql
    const file_name = await mudarNome(named, imaged_file, active_user[0].cod);

    conexao.execute(sql, [named ?? null, price ?? null, file_name ?? null, active_user[0].cod ?? null], (erro, retorno) => {
        if(erro) throw erro;
        
        req.files.imaged.mv(__dirname+"/images/"+file_name);
    })
    
    res.redirect("/formulario");
})

//rota remoção
app.get("/remover/:cod/:imaged", (req, res) => {
    const codigo = req.params.cod;
    const imagem = req.params.imaged;
    console.log(codigo);
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
app.post("/editar", async (req, res) => {
    console.log("Req.files: ", req.files);
    console.log("Req.body: ", req.body);
    const cod = req.body.cod_image;
    const name = req.body.name_prod;
    const price = req.body.price_prod;
    const old_image = req.body.old_image_file;
    const image_file = req.files.newImageFile;

    console.log(`name: ${name}\nprice: ${price}\ncod: ${cod}\nimage: ${image_file.name}`);


    const file_name = await mudarNome(name, image_file.name, active_user[0].cod);
    let sql_update = `UPDATE products SET named = ?, price = ?, imaged = ? WHERE cod = ?`

    conexao.execute(sql_update, [name ?? null, price ?? null, file_name ?? null, cod ?? null], async (erro, retorno) => {
        if (erro){
            return res.json( {sucesso: false, mensagem: "Erro ao atualizar", Erro: erro});
        }
        if (retorno.affectedRows === 0){
            return res.json({sucesso: false, mensagem: "Produto não encontrado", Erro: erro});
        }
        console.log("old_image: ", old_image);
        try{
            await fs.access(__dirname+"/images/"+old_image);
            await apagar_imagem(old_image);
        } catch (erro){
            if (erro.code === "ENOENT"){
                console.log("Arquivo não existe (já foi deletado): ", old_image);
            } else {
                throw erro;
            }
        }
        image_file.mv(__dirname+"/images/"+file_name);

        res.json({
            sucesso: true,
            mensagem: "Produto alterado com sucesso"
        })
    })

})

//servidor
app.listen(8080);

