/**
 * @type {HTMLDivElement[]}
 */
const containers = Array.from(document.querySelectorAll(".container"));

/**
 * @type {HTMLDivElement | null}
 */
let containerAtual = containers.find(container => container.classList.contains("display"));

/**
 * Mostrar container
 * @param {string} nome
 */
export function showContainer(nome) {
    if (containerAtual !== undefined) {
        containerAtual.classList.remove("display");
    }

    const container = containers.find(container => container.dataset.name === nome);

    if (!container) {
        console.warn(`O container ${nome} não foi encontrado!`);
        return;
    }

    container.classList.add("display");
    containerAtual = container;
}

for (const elemento of document.querySelectorAll("[data-redirect]")) {
    elemento.addEventListener("click", (event) => {
        event.preventDefault();
        showContainer(elemento.dataset.redirect);
    });
}