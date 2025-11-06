"use strict";

async function remover(cod_prod, image_prod) {
   fetch(`/formulario/remover/${cod_prod}/${image_prod}`, {
        method: "DELETE"
   })
   .then(res => res.json())
   .then(dados => {
        toast(dados.mensagem, dados.sucesso, dados.error);
   })
}

const removerBtn = document.querySelectorAll(".removerBtn");

const nomeProdutoRemover = document.getElementById("nome-produto-remover");

const cancelarBtn = document.getElementById("cancelar-btn-remover");
const modalImage = document.getElementById("modal-image");

const confirmarBtn = document.getElementById("confirmar-btn-remover");

const myModalRemover = new bootstrap.Modal(document.getElementById("modalRemover"));

removerBtn.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        console.log("executou");
        image = cardImage[index].dataset.image; 
        const name = cardImage[index].dataset.named;
        cod_image = cardImage[index].dataset.cod;
        
        myModalRemover.show();
        
        modalImage.src = `../images/${image}`;
        
        nomeProdutoRemover.textContent = name;
        
        cancelarBtn.addEventListener("click",()=>{
            myModalRemover.hide();
            console.log(image);
        })
        
    })
});

confirmarBtn.addEventListener("click",()=>{
    remover(cod_image, image);
    (async () => {
        myModalRemover.hide();
        await sleep(3000);
        window.location.reload();
    })();
});