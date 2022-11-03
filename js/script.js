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
    return coordenadas
}

seleccionarPieza = (pieza = null) => {
    let piezaSeleccionada
    //Borro la clase de todas las casillas menos la casilla que ya lo estaba para hacer el toggle
    casillas.forEach(fila => {
        fila.forEach(casilla => {
            if (casilla.textContent === "\u{25CF}") {
                casilla.textContent = ""
            }
            if (pieza !== casilla) {
                casilla.classList.remove("seleccionada")
                casilla.classList.remove("posibleDestinoVacio")
                casilla.classList.remove("posibleDestinoRival")
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

marcarPosicionesPosibles = (casillasPosiblesVacias, casillasPosiblesEnemigas) => {
    //Marco las posiciones posibles vacias
    casillasPosiblesVacias.forEach(casilla => {
        casilla.textContent = "\u{25CF}"
        casilla.classList.add("posibleDestinoVacio")
    })
    //Marco las posiciones con piezas rivales posibles
    casillasPosiblesEnemigas.forEach(casilla => {
        casilla.classList.add("posibleDestinoRival")
    })
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

movimientoPeon = (piezaEnemiga, posicionBase, movimientoFrontal, casillasPosiblesVacias = [], casillasPosiblesEnemigas = []) => {
    if ((posicionPiezaSeleccionada[0] + movimientoFrontal <= 7) && (posicionPiezaSeleccionada[0] + movimientoFrontal >= 0)) {//Si la casilla a comprobar existe
        casillaComprobar = casillas[posicionPiezaSeleccionada[0] + movimientoFrontal][posicionPiezaSeleccionada[1]]
        if (casillaComprobar.textContent === "") {
            casillasPosiblesVacias.push(casillaComprobar)
            if (posicionPiezaSeleccionada[0] === posicionBase && casillas[posicionPiezaSeleccionada[0] + movimientoFrontal * 2][posicionPiezaSeleccionada[1]].textContent === "") {//Si el peón está en la posición de inicio y la siguiente también está vacía puede avanzar 2
                console.log(casillaComprobar.nextElementSibling)
                casillasPosiblesVacias.push(casillas[posicionPiezaSeleccionada[0] + movimientoFrontal * 2][posicionPiezaSeleccionada[1]])
            }
        }
        if (casillaComprobar.nextElementSibling != undefined && casillaComprobar.nextElementSibling.classList.contains(piezaEnemiga)) {//Si existe la casilla diagonal derecha y tiene una pieza enemiga
            casillasPosiblesEnemigas.push(casillaComprobar.nextElementSibling)
        }
        if (casillaComprobar.previousElementSibling != undefined && casillaComprobar.previousElementSibling.classList.contains(piezaEnemiga)) {//Si existe la casilla diagonal Izq y tiene una pieza enemiga
            casillasPosiblesEnemigas.push(casillaComprobar.previousElementSibling)
        }
    }
    marcarPosicionesPosibles(casillasPosiblesVacias, casillasPosiblesEnemigas)
}

movimientoLineal = (piezaEnemiga, movimientoFrontal = 0, movimientoLateral = 0, casillasPosiblesVacias = [], casillasPosiblesEnemigas = []) => {
    posicionDisponible = true
    while (posicionDisponible && ((posicionPiezaSeleccionada[0] + movimientoFrontal <= 7) && (posicionPiezaSeleccionada[0] + movimientoFrontal >= 0) && (posicionPiezaSeleccionada[1] + movimientoLateral <= 7) && (posicionPiezaSeleccionada[1] + movimientoLateral >= 0))) {//Mientras no encuentre una casilla ocupada y la casilla exista en el tablero
        casillaComprobar = casillas[posicionPiezaSeleccionada[0] + movimientoFrontal][posicionPiezaSeleccionada[1] + movimientoLateral]

        if (casillaComprobar.textContent === "") {//Si la posición está vacía
            casillasPosiblesVacias.push(casillaComprobar)
            //******llamar aquí a la función del peon: si está en la posición base comprobar la siguiente */
        } else {//Si no está vacía será la última casilla que comprobará
            posicionDisponible = false
            if (casillaComprobar.classList.contains(piezaEnemiga)) {//Si contiene una pieza enemiga
                casillasPosiblesEnemigas.push(casillaComprobar)
            }
        }
        //Aumento el contador que va comprobando las celdas
        if (movimientoFrontal > 0) {
            movimientoFrontal++
        } else if (movimientoFrontal < 0) {
            movimientoFrontal--
        }
        if (movimientoLateral > 0) {
            movimientoLateral++
        } else if (movimientoLateral < 0) {
            movimientoLateral--
        }
    }
    marcarPosicionesPosibles(casillasPosiblesVacias, casillasPosiblesEnemigas)
}

controladorCasillasPosibles = (pieza) => {
    casillasPosiblesVacias = []
    casillasPosiblesEnemigas = []
    if (turnoBlancas) {
        piezaEnemiga = "piezaNegra"
    } else {
        piezaEnemiga = "piezaBlanca"
    }
    posicionPiezaSeleccionada = posicionPieza(pieza)
    if (pieza.textContent === pawn) {//Peón
        console.log("peón")
        if (turnoBlancas) {
            posicionBasePeon = 6
            movimientoFrontal = -1
        } else {
            posicionBasePeon = 1
            movimientoFrontal = 1
        }
        movimientoPeon(piezaEnemiga, posicionBasePeon, movimientoFrontal)
    } else if (pieza.textContent === rook) {//Torre
        console.log("torre")
        //Movimientos Laterales/frontales
        movimientoLineal(piezaEnemiga, 1, 0)
        movimientoLineal(piezaEnemiga, -1, 0)
        movimientoLineal(piezaEnemiga, 0, 1)
        movimientoLineal(piezaEnemiga, 0, -1)
    } else if (pieza.textContent === knight) {//Caballo
        console.log("caballo")
    } else if (pieza.textContent === bishop) {//Alfil
        //Movimientos diagonales
        movimientoLineal(piezaEnemiga, 1, 1)
        movimientoLineal(piezaEnemiga, 1, -1)
        movimientoLineal(piezaEnemiga, -1, -1)
        movimientoLineal(piezaEnemiga, -1, 1)
        console.log("alfil")
    } else if (pieza.textContent === queen) {//Dama
        console.log("dama")
        //Movimientos laterales/frontales
        movimientoLineal(piezaEnemiga, 1, 0)
        movimientoLineal(piezaEnemiga, -1, 0)
        movimientoLineal(piezaEnemiga, 0, 1)
        movimientoLineal(piezaEnemiga, 0, -1)
        //Movimientos diagonales       movimientoLineal(piezaEnemiga, 1, 0)
        movimientoLineal(piezaEnemiga, 1, 1)
        movimientoLineal(piezaEnemiga, 1, -1)
        movimientoLineal(piezaEnemiga, -1, -1)
        movimientoLineal(piezaEnemiga, -1, 1)
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
    if (casilla.classList.contains("posibleDestinoVacio") || casilla.classList.contains("posibleDestinoRival")) {//Si pulsa sobre la casilla de destino
        console.log("destino")
        moverPieza(casilla)
    }

}


//*LISTENERS
document.addEventListener("DOMContentLoaded", cargarPiezas)
document.addEventListener("click", controladorJuego)