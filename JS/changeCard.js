"use strict";

async function editar(form_response) {
    fetch("/formulario/editar", {
        method: "PUT",
        body: form_response
    })
    .then(resposta => resposta.json())
    .then(dados => {
        toast(dados.mensagem, dados.sucesso, dados.error);
    })

}

const formAlterar = document.getElementById("form-alterar");



const changeBtn = document.querySelectorAll(".changeBtn");
const cancelarBtnAlterar = document.getElementById("cancelarBtnAlterar");

const myModalEditar = new bootstrap.Modal(document.getElementById("modalAlterar"));

changeBtn.forEach((btn, index) => {
    btn.addEventListener("click", () =>{
        // puxando o código do item selecionado para mandar para o node
        cod_image = cardImage[index].dataset.cod;
        image = cardImage[index].dataset.image;


        myModalEditar.show();

        cancelarBtnAlterar.addEventListener("click", ()=>{
            myModalEditar.hide();
        })
    })
});

formAlterar.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameProd = document.getElementById("name-prod").value;

    const priceProd = document.getElementById("price-prod").value;

    const inputImageFile = document.getElementById("image-file");


    const newImageFile = inputImageFile.files[0]
    

    const formData = new FormData();

    formData.append("newImageFile", newImageFile);
    formData.append("cod_image", cod_image);
    formData.append("name_prod", nameProd);
    formData.append("price_prod", priceProd);
    formData.append("old_image_file", image);

    editar(formData);

    (async () => {
        myModalEditar.hide();
        await sleep(3000);
        window.location.reload();
    })();
})


