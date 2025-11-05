"use strict";

const removerBtn = document.querySelectorAll(".removerBtn");

const nomeProdutoRemover = document.getElementById("nome-produto-remover");

const cancelarBtn = document.getElementById("cancelar-btn-remover");
const modalImage = document.getElementById("modal-image");

const confirmarBtn = document.getElementById("confirmar-btn-remover");


removerBtn.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        console.log("executou");
        image = cardImage[index].dataset.image; 
        const name = cardImage[index].dataset.named;
        cod_image = cardImage[index].dataset.cod;
        const myModal = new bootstrap.Modal(document.getElementById("modalRemover"));
        
        myModal.show();
        
        modalImage.src = `../images/${image}`;
        
        nomeProdutoRemover.textContent = name;
        
        cancelarBtn.addEventListener("click",()=>{
            myModal.hide();
            console.log(image);
        })
        
    })
});

confirmarBtn.addEventListener("click",()=>{
    console.log(image);
    window.location.href = `/remover/${cod_image}/${image}`;
});