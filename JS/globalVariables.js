// Usado para puxar as informações da carta selecionada
const cardImage = document.querySelectorAll(".card-image");

//variáveis para armazenar o dataset
let named = null;
let price = null;
let cod_image = null;
let image = null;

// Toast para notificar erro ou sucesso
function toast(texto, sucesso, erro){
    if (sucesso){
        Toastify({
            text: texto,
            duration: 3000,
            gravity: "top",
            position: "center",
            style: {
                background: "darkgreen",
                color: "whitesmoke",
                borderRadius: "10px",
                fontWeight: "bold"
            },
            stopOnFocus: true
        }).showToast();
    } else {
        console.error("Erro: ", erro);
        Toastify({
            text: texto,
            duration: 4000,
            gravity: "top",
            position: "center",
            style: {
                background: "darkred",
                color: "whitesmoke",
                borderRadius: "10px",
                fontWeight: "bold"
            },
            stopOnFocus: true
        }).showToast();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}