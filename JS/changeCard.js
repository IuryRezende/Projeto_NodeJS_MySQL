"use strict";

async function editar(form_response) {
    fetch("/editar", {
        method: "POST",
        body: form_response
    })
    .then(resposta => resposta.json())
    .then(dados => {
        dados.sucesso ? alert("Sucesso: ", dados.mensagem) : alert("Erro: ", dados.mensagem);
    })

}

const formAlterar = document.getElementById("form-alterar");



const changeBtn = document.querySelectorAll(".changeBtn");
const cancelarBtnAlterar = document.getElementById("cancelarBtnAlterar");


changeBtn.forEach((btn, index) => {
    btn.addEventListener("click", () =>{
        // puxando o código do item selecionado para mandar para o node
        cod_image = cardImage[index].dataset.cod;
        image = cardImage[index].dataset.image;

        const myModal = new bootstrap.Modal(document.getElementById("modalAlterar"));

        myModal.show();

        cancelarBtnAlterar.addEventListener("click", ()=>{
            myModal.hide();
        })
    })
});

formAlterar.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameProd = document.getElementById("name-prod").value;

    const priceProd = document.getElementById("price-prod").value;

    const inputImageFile = document.getElementById("image-file");

    console.log("Recebeu o input: ", inputImageFile, "\n\n\n");

    const newImageFile = inputImageFile.files[0]
    
    console.log("Armazenou a imagem: ", newImageFile, "\n\n\n");

    const formData = new FormData();

    formData.append("newImageFile", newImageFile);
    formData.append("cod_image", cod_image);
    formData.append("name_prod", nameProd);
    formData.append("price_prod", priceProd);
    formData.append("old_image_file", image);

    editar(formData);
})


