const removerBtn = document.querySelectorAll(".removerBtn");

const cardImage = document.querySelectorAll(".card-image");



const cancelarBtn = document.getElementById("cancelarBtn");
const modalImage = document.getElementById("modal-image");

const confirmarBtn = document.getElementById("confirmarBtn");

removerBtn.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        console.log("executou");
        const image = cardImage[index].dataset.image; 
        const cod = cardImage[index].dataset.cod; 
        const myModal = new bootstrap.Modal(document.getElementById("modalRemover"));

        myModal.show();
        modalImage.style.backgroundRepeat = "no-repeat";
        modalImage.style.backgroundSize = "cover";
        modalImage.style.width = "100%";

        modalImage.src = `../images/${image}`;

        cancelarBtn.addEventListener("click",()=>{
            myModal.hide();
        })

        confirmarBtn.addEventListener("click",()=>{
            window.location.href = `/remover/${cod}/${image}`;
        });
    })
});
