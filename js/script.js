//*Piezas
const pawn = "\u{265F}"
const knight = "\u{265E}"
const bishop = "\u{265D}"
const rook = "	\u{265C}"
const queen = "\u{265B}"
const king = "\u{265A}"
//Array con las piezas: contiene un array de las blancas y otro de las negras
const piezas = [rook, knight, bishop, queen, king, bishop, knight, rook, pawn]
//*Identifico los elementos que voy a utilizar
const tablero = document.querySelector("#tablero")
const casillas = Array.from(document.querySelectorAll(".tablero__row"))
//Casillas será un array de arrays: cada fila tendrá su propio array de sus casillas
casillas.forEach((fila, index) => {
    casillas[index] = fila.querySelectorAll(".tablero__casilla")

});

//*Variables a utilizar
let turnoBlancas = true;//True será white y false será black
let piezaSeleccionada
let posicionPiezaSeleccionada

const cargarPiezas = () => {
    let primeraFila = tablero.firstElementChild
    let ultimaFila = tablero.lastElementChild
    for (let i = 0; i < tablero.firstElementChild.children.length; i++) {
        //Piezas
        primeraFila.children[i].textContent = piezas[i]
        primeraFila.children[i].classList.add("piezaNegra")
        ultimaFila.children[i].textContent = piezas[i]
        ultimaFila.children[i].classList.add("piezaBlanca")

        //Peones
        primeraFila.nextElementSibling.children[i].textContent = pawn;
        primeraFila.nextElementSibling.children[i].classList.add("piezaNegra")
        ultimaFila.previousElementSibling.children[i].textContent = pawn;
        ultimaFila.previousElementSibling.children[i].classList.add("piezaBlanca")


    }
}

posicionPieza = (pieza) => {
    let coordenadas = []
    casillas.forEach((fila, indexFila) => {
        fila.forEach((casilla, indexCasilla) => {
            if (pieza === casilla) {
                coordenadas[1] = indexCasilla
                coordenadas[0] = indexFila
            }
        })
    })
    console.log(coordenadas)
    return coordenadas
}

seleccionarPieza = (pieza = null) => {
    let piezaSeleccionada
    //Borro la clase de todas las casillas menos la casilla que ya lo estaba para hacer el toggle
    casillas.forEach(fila => {
        fila.forEach(casilla => {
            if (pieza !== casilla) {
                casilla.classList.remove("seleccionada")
                casilla.classList.remove("posibleDestino")
            } else {
                piezaSeleccionada = casilla
            }
        })
    })
    //Marco/desmarco la pieza
    if (pieza !== null) {
        pieza.classList.toggle("seleccionada")
    }
}

marcarPosicionesPosibles = (casillasPosibles) => {
    casillasPosibles.forEach(casilla => {
        casilla.classList.add("posibleDestino")
    });
}

moverPieza = (destino) => {
    posicionDestino = posicionPieza(destino)
    casillaDestino = casillas[posicionDestino[0]][posicionDestino[1]]
    casillaOrigen = casillas[posicionPiezaSeleccionada[0]][posicionPiezaSeleccionada[1]]
    //Pongo la pieza en su lugar de destino y sus clases
    casillaDestino.textContent = casillaOrigen.textContent
    //Elmino la pieza de su origen
    casillaOrigen.textContent = ""
    //Añado la clase al destino y la elimino del origen y cambio el turno
    if (turnoBlancas) {
        casillaDestino.classList.remove("piezaNegra")
        casillaDestino.classList.add("piezaBlanca")
        casillaOrigen.classList.remove("piezaBlanca")
        turnoBlancas = false
    } else {
        casillaDestino.classList.remove("piezaBlanca")
        casillaDestino.classList.add("piezaNegra")
        casillaOrigen.classList.remove("piezaNegra")
        turnoBlancas = true
    }
    seleccionarPieza()//Reseteo las clases de las casillas
}

movimientoPeon = (peon) => {
    let posicionBase, desplazamiento1, desplazamiento2, casillaFrontal, casillaFrontal2, casillaDiagonalIzq, casillaDiagonalDer
    if (turnoBlancas) {//Si es un peón blanco
        posicionBase = 6
        desplazamiento1 = -1
        desplazamiento2 = -2
        piezasEnemigas = "piezaNegra"
    } else {//Si es un peón negro
        posicionBase = 1
        desplazamiento1 = 1
        desplazamiento2 = 2
        piezasEnemigas = "piezaBlanca"
    }
    casillaFrontal = casillas[posicionPiezaSeleccionada[0] + desplazamiento1][posicionPiezaSeleccionada[1]]
    casillaFrontal2 = casillas[posicionPiezaSeleccionada[0] + desplazamiento2][posicionPiezaSeleccionada[1]]
    casillaDiagonalIzq = casillas[posicionPiezaSeleccionada[0] + desplazamiento1][posicionPiezaSeleccionada[1] - 1]
    casillaDiagonalDer = casillas[posicionPiezaSeleccionada[0] + desplazamiento1][posicionPiezaSeleccionada[1] + 1]
    console.log(casillaDiagonalIzq, casillaDiagonalDer)
    casillasPosibles = []
    //Compruebo los posibles destinos y los añado al array casillasPosibles
    //Compruebo si los posibles destinos están vacios
    if (casillaFrontal.textContent === "") {
        casillasPosibles.push(casillaFrontal)
        if (posicionPiezaSeleccionada[0] === posicionBase && casillaFrontal2.textContent === "") { //Si el peón está en la posición original
            casillasPosibles.push(casillaFrontal2)
        }
    }
    //*****Error al comer piezas que no sean peones: dice que casillaDiagonal es undefined cuando sí existe */
    console.log(casillas[1][4])
    console.log(casillaDiagonalIzq.classList.contains(piezasEnemigas))
    if (casillaDiagonalIzq !== undefined && casillaDiagonalIzq.classList.contains(piezasEnemigas)) {
        casillasPosibles.push(casillaDiagonalIzq)
    }
    if (casillaDiagonalDer !== undefined && casillaDiagonalDer.classList.contains(piezasEnemigas)) {
        casillasPosibles.push(casillaDiagonalDer)
    }
    marcarPosicionesPosibles(casillasPosibles)
}

controladorCasillasPosibles = (pieza) => {
    posicionPiezaSeleccionada = posicionPieza(pieza)
    if (pieza.textContent === pawn) {//Peón
        console.log("peón")
        movimientoPeon(pieza, posicionPiezaSeleccionada)
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
    casilla = ev.target
    if (piezas.includes(casilla.textContent)) {//Ha seleccionado alguna pieza
        piezaSeleccionada = casilla
        if (turnoBlancas && casilla.classList.contains("piezaBlanca")) {//Turno Blancas
            seleccionarPieza(casilla)
        } else if (!turnoBlancas && casilla.classList.contains("piezaNegra")) {//Turno Negras
            seleccionarPieza(casilla)
        }
        if (casilla.classList.contains("seleccionada")) {//Compruebo los movimientos posibles de la casilla seleccionada
            controladorCasillasPosibles(casilla)
        }
    }
    if (casilla.classList.contains("posibleDestino")) {//Si pulsa sobre la casilla de destino
        console.log("destino")
        moverPieza(casilla)
    }

}


//*LISTENERS
document.addEventListener("DOMContentLoaded", cargarPiezas)
document.addEventListener("click", controladorJuego)