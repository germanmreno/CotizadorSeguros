function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

Seguro.prototype.cotizarSeguro = function () {
    let cantidad;
    const base = 2000;

    switch (this.marca) {
        case "1":
            cantidad = base * 1.15;
            break;
        case "2":
            cantidad = base * 1.05;
            break;
        case "3":
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    const diferencia = new Date().getFullYear() - this.year;

    cantidad -= (diferencia * 3 * cantidad) / 100;

    if (this.tipo === "Básico") {
        cantidad *= 1.3;
    } else {
        cantidad *= 1.5;
    }

    return cantidad;
};

function UI() {}

UI.prototype.renderYearOptions = () => {
    const max = new Date().getFullYear(),
        min = max - 20;

    const selectYear = document.querySelector("#year");

    for (let i = max; i > min; i--) {
        const yearOption = document.createElement("option");
        yearOption.value = i;
        yearOption.textContent = i;

        selectYear.appendChild(yearOption);
    }
};

UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement("div");

    if (tipo === "error") {
        div.classList.add("error");
    } else {
        div.classList.add("correcto");
    }

    div.classList.add("mensaje", "mt-10");
    div.textContent = mensaje;

    const formulario = document.querySelector("#cotizar-seguro");
    formulario.insertBefore(div, document.querySelector("#resultado"));

    setTimeout(() => {
        div.remove();
    }, 3000);
};

UI.prototype.mostrarResultado = (total, seguro) => {
    const div = document.createElement("div");

    const { marca, year, tipo } = seguro;
    let nombreMarca;

    switch (marca) {
        case "1":
            nombreMarca = "Americano";
            break;
        case "2":
            nombreMarca = "Asiático";
            break;
        case "3":
            nombreMarca = "Europeo";
            break;
        default:
            break;
    }

    div.classList.add("mt-10");

    div.innerHTML = `
    <p class="header">Tu Resumen:</p>
    <p class="font-bold">Marca: <span class="font-normal">${nombreMarca}</span></p>
    <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
    <p class="font-bold">Tipo: <span class="font-normal">${tipo}</span></p>
    <p class="font-bold">Total: <span class="font-normal">${total}$</span></p>`;

    const resultadoDiv = document.querySelector("#resultado");

    const spinner = document.querySelector("#cargando");
    spinner.style.display = "block";

    setTimeout(() => {
        spinner.style.display = "none";
        resultadoDiv.appendChild(div);
    }, 3000);
};

const userInterface = new UI();

document.addEventListener("DOMContentLoaded", userInterface.renderYearOptions);

eventListeners();
function eventListeners() {
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();

    const marca = document.querySelector("#marca").value;
    const year = document.querySelector("#year").value;

    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if (marca === "" || year === "" || tipo === "") {
        userInterface.mostrarMensaje("Todos los campos son obligatorios", "error");
        return;
    }

    userInterface.mostrarMensaje("Cotizando...", "exito");

    const resultados = document.querySelector("#resultado");

    while (resultados.firstChild) {
        resultados.removeChild(resultados.firstChild);
    }

    const seguro = new Seguro(marca, year, tipo);

    const total = seguro.cotizarSeguro();

    userInterface.mostrarResultado(total, seguro);
}
