function mudarImagem(image){
    overlay.style.backgroundImage = `url('../images/${image}')`;
    overlay.style.opacity = 1;

}

const cards = document.querySelectorAll(".card");

const overlay = document.getElementById("bg-overlay")

cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        const imaged = card.dataset.image;
        mudarImagem(imaged);
    })

    card.addEventListener("mouseleave", () => {
        overlay.style.opacity = 0;
    })
});