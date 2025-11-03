const mysql = require('mysql2/promise');

async function testar() {
    try {
        console.log('1. Criando conexão...');
        
        const conexao = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            port: "3307",
            password: 'Iuriza060423!',  // ← Coloque sua senha
            database: 'projeto_node'    // ← Coloque seu banco
        });
        
        console.log('2. Conexão criada com sucesso!');
        console.log('3. Tipo da conexão:', typeof conexao);
        console.log('4. Tem método execute?', typeof conexao.execute);
        
        console.log('5. Executando query...');
        
        const resultado = await conexao.execute("SELECT 1 + 1 AS resultado");
        
        console.log('6. Resultado completo:', resultado);
        console.log('7. Tipo do resultado:', typeof resultado);
        console.log('8. É array?', Array.isArray(resultado));
        
        if (Array.isArray(resultado)) {
            const [rows, fields] = resultado;
            console.log('9. Rows:', rows);
            console.log('10. Fields:', fields);
        }
        
        await conexao.end();
        console.log('11. Conexão fechada!');
        
    } catch (erro) {
        console.error('❌ ERRO:', erro.message);
        console.error('Stack:', erro.stack);
    }
}

testar();