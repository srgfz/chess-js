//*Piezas
const pawn = "\u{265F}"
const knight = "\u{265E}"
const bishop = "\u{265D}"
const rook = "	\u{265C}"
const queen = "\u{265B}"
const king = "\u{265A}"
//Array con las piezas: contiene un array de las blancas y otro de las negras
const piezasBlancas = [rook, knight, bishop, queen, king, bishop, knight, rook]
const piezasNegras = [rook, knight, bishop, queen, king, bishop, knight, rook]
//*Identifico los elementos que voy a utilizar
const tablero = document.querySelector("#tablero")
const filas = Array.from(document.querySelectorAll(".row"))
//*Variables a utilizar
let turno = true;//True será white y false será black

const cargarPiezas = () => {
    let primeraFila = tablero.firstElementChild
    let ultimaFila = tablero.lastElementChild
    for (let index = 0; index < tablero.firstElementChild.children.length; index++) {
        //Piezas
        primeraFila.children[index].textContent = piezasNegras[index]
        primeraFila.children[index].classList.add("piezaNegra")
        ultimaFila.children[index].textContent = piezasBlancas[index]
        ultimaFila.children[index].classList.add("piezaBlanca")

        //Peones
        primeraFila.nextElementSibling.children[index].textContent = pawn;
        primeraFila.nextElementSibling.children[index].classList.add("piezaNegra")
        ultimaFila.previousElementSibling.children[index].textContent = pawn;
        ultimaFila.previousElementSibling.children[index].classList.add("piezaBlanca")


    }
}

seleccionarPieza = (pieza) => {
    //Borro la clase de todas las casillas menos la casilla que ya lo estaba para hacer el toggle
    filas.forEach(fila => {
        for (let index = 0; index < filas.length; index++) {
            if (pieza !== fila.children[index]) {
                fila.children[index].classList.remove("seleccionada")
            }
        }
    })
    //Marco/desmarco la pieza
    pieza.classList.toggle("seleccionada")
}

casillasPosibles = (pieza) => {
    if (pieza.textContent === pawn) {//Peón
        console.log("peón")
    } else if (pieza.textContent === rook) {//Torre
        console.log("torre")
    } else if (pieza.textContent === knight) {//Caballo
        console.log("caballo")
    } else if (pieza.textContent === bishop) {//Alfil
        console.log("alfil")
    } else if (pieza.textContent === queen) {//Dama
        console.log("dama")
    } else if (pieza.textContent === king) {//Rey
        console.log("rey")
    }
}

controladorJuego = (ev) => {
    boton = ev.target
    if (piezasBlancas.includes(boton.textContent) || boton.textContent === pawn) {//Ha seleccionado alguna pieza
        seleccionarPieza(boton)
        if (boton.classList.contains("seleccionada")) {//Compruebo los movimientos posibles de la casilla seleccionada
            casillasPosibles(boton)
        }

    }

}


//Cargar Piezas
document.addEventListener("DOMContentLoaded", cargarPiezas)
document.addEventListener("click", controladorJuego)