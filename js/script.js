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
let posicionComprobacionMovimientoRey

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
                casilla.classList.remove("futuroDestinoPosible")
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

marcarPosicionesPosibles = (casillasPosiblesVacias, casillasPosiblesEnemigas, comprobacionRey = false) => {
    if (!comprobacionRey) {//Si no es una comprobación de los movimientos del Rey
        //Marco las posiciones posibles vacias
        casillasPosiblesVacias.forEach(casilla => {
            casilla.textContent = "\u{25CF}"
            casilla.classList.add("posibleDestinoVacio")
        })
        //Marco las posiciones con piezas rivales posibles
        casillasPosiblesEnemigas.forEach(casilla => {
            casilla.classList.add("posibleDestinoRival")
        })
    } else {//Si es una comprobación de los movimientos del Rey
        casillasPosiblesVacias.forEach(casilla => {
            casilla.classList.add("futuroDestinoPosible")
        })
    }

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

movimientoPeon = (piezaEnemiga, posicionBase, movimientoFrontal, posicionOrigen = posicionPiezaSeleccionada, casillasPosiblesVacias = [], casillasPosiblesEnemigas = []) => {
    if ((posicionOrigen[0] + movimientoFrontal <= 7) && (posicionOrigen[0] + movimientoFrontal >= 0)) {//Si la casilla a comprobar existe
        casillaComprobar = casillas[posicionOrigen[0] + movimientoFrontal][posicionOrigen[1]]
        if (casillaComprobar.textContent === "") {
            casillasPosiblesVacias.push(casillaComprobar)
            if (posicionOrigen[0] === posicionBase && casillas[posicionOrigen[0] + movimientoFrontal * 2][posicionOrigen[1]].textContent === "") {//Si el peón está en la posición de inicio y la siguiente también está vacía puede avanzar 2
                casillasPosiblesVacias.push(casillas[posicionOrigen[0] + movimientoFrontal * 2][posicionOrigen[1]])
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

movimientoLineal = (piezaEnemiga, movimientoFrontal = 0, movimientoLateral = 0, movimientoRey = false, comprobacionRey = false, posicionOrigen = posicionPiezaSeleccionada, casillasPosiblesVacias = [], casillasPosiblesEnemigas = []) => {
    posicionDisponible = true
    while (posicionDisponible && ((posicionOrigen[0] + movimientoFrontal <= 7) && (posicionOrigen[0] + movimientoFrontal >= 0) && (posicionOrigen[1] + movimientoLateral <= 7) && (posicionOrigen[1] + movimientoLateral >= 0))) {//Mientras no encuentre una casilla ocupada y la casilla exista en el tablero
        casillaComprobar = casillas[posicionOrigen[0] + movimientoFrontal][posicionOrigen[1] + movimientoLateral]
        if (casillaComprobar.textContent === "") {//Si la posición está vacía
            casillasPosiblesVacias.push(casillaComprobar)
        } else {//Si no está vacía será la última casilla que comprobará
            posicionDisponible = false
            if (casillaComprobar.classList.contains(piezaEnemiga)) {//Si contiene una pieza enemiga
                casillasPosiblesEnemigas.push(casillaComprobar)
            }
        }
        if (movimientoRey) {//Si se trata del movimiento del rey
            posicionDisponible = false
            comprobarCasillasRey(piezaEnemiga)
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
    // if (comprobacionRey) {
    //     casillasPosiblesVacias = eliminarPosiblesCasillasRey(casillasPosiblesVacias)
    //     casillasPosiblesEnemigas = eliminarPosiblesCasillasRey(casillasPosiblesEnemigas)
    // }
    // console.log("***********")
    // console.log(movimientoRey, comprobacionRey)
    // console.log(movimientoFrontal)
    // console.log("***********")
    if (movimientoRey && comprobacionRey) {
        casillasPosiblesVacias = eliminarPosiblesCasillasRey(casillasPosiblesVacias)
        casillasPosiblesEnemigas = eliminarPosiblesCasillasRey(casillasPosiblesEnemigas)
        comprobacionRey = false
    }
    marcarPosicionesPosibles(casillasPosiblesVacias, casillasPosiblesEnemigas, comprobacionRey)
}

movimientoCaballo = (piezaEnemiga, desplazamientoFrontal, desplazamientoLateral, comprobacionRey = false, posicionOrigen = posicionPiezaSeleccionada, casillasPosiblesVacias = [], casillasPosiblesEnemigas = []) => {
    if ((posicionOrigen[0] + desplazamientoFrontal <= 7) && (posicionOrigen[0] + desplazamientoFrontal >= 0) && (posicionOrigen[1] + desplazamientoLateral <= 7) && (posicionOrigen[1] + desplazamientoLateral >= 0)) {
        casillaComprobar = casillas[posicionOrigen[0] + desplazamientoFrontal][posicionOrigen[1] + desplazamientoLateral]
        if (casillaComprobar.textContent === "") {//Si la casilla está vacía
            casillasPosiblesVacias.push(casillaComprobar)
        } else if (casillaComprobar.classList.contains(piezaEnemiga)) {//Si la casilla tiene una pieza enemiga
            casillasPosiblesEnemigas.push(casillaComprobar)
        }
    }
    marcarPosicionesPosibles(casillasPosiblesVacias, casillasPosiblesEnemigas, comprobacionRey)
}

comprobarCasillasRey = (piezaEnemiga) => {
    let posicionComprobar
    //Recorro todo el tablero buscando piezas Enemigas para comprobar sus posibles movimientos en el siguiente turno
    casillas.forEach(fila => {
        fila.forEach(casilla => {//Marco todos los posibles movimientos enemigos del proximo turno con la clase ".futuroDestinoPosible"
            if (casilla.classList.contains(piezaEnemiga)) {//Si la casilla tiene una pieza enemiga
                posicionComprobar = posicionPieza(casilla)//Actualizo la posición de la pieza seleccionada a la pieza de la que voy a ir haciendo la comprobación
                if (casilla.textContent === knight) {//comprobación del caballo
                    movimientoCaballo(piezaEnemiga, 2, 1, true, posicionComprobar)
                    movimientoCaballo(piezaEnemiga, 2, -1, true, posicionComprobar)
                    movimientoCaballo(piezaEnemiga, -2, 1, true, posicionComprobar)
                    movimientoCaballo(piezaEnemiga, -2, -1, true, posicionComprobar)
                    movimientoCaballo(piezaEnemiga, 1, 2, true, posicionComprobar)
                    movimientoCaballo(piezaEnemiga, 1, -2, true, posicionComprobar)
                    movimientoCaballo(piezaEnemiga, -1, 2, true, posicionComprobar)
                    movimientoCaballo(piezaEnemiga, -1, -2, true, posicionComprobar)
                } else if (casilla.textContent === rook) {//comprobación de la torre
                    movimientoLineal(piezaEnemiga, 1, 0, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, -1, 0, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, 0, 1, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, 0, -1, false, true, posicionComprobar)
                } else if (casilla.textContent === bishop) {//comprobación del alfil
                    movimientoLineal(piezaEnemiga, 1, 1, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, 1, -1, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, -1, -1, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, -1, 1, false, true, posicionComprobar)
                } else if (casilla.textContent === queen) {//comprobación de la reina
                    //Movimientos laterales/frontales
                    movimientoLineal(piezaEnemiga, 1, 0, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, -1, 0, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, 0, 1, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, 0, -1, false, true, posicionComprobar)
                    //Movimientos diagonales
                    movimientoLineal(piezaEnemiga, 1, 1, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, 1, -1, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, -1, -1, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, -1, 1, false, true, posicionComprobar)
                } else if (casilla.textContent === king) {//comprobación del rey
                    movimientoLineal(piezaEnemiga, 1, 0, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, -1, 0, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, 0, 1, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, 0, -1, false, true, posicionComprobar)
                    //Movimientos diagonales
                    movimientoLineal(piezaEnemiga, 1, 1, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, 1, -1, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, -1, -1, false, true, posicionComprobar)
                    movimientoLineal(piezaEnemiga, -1, 1, false, true, posicionComprobar)
                }
            }
        })
    })
}

eliminarPosiblesCasillasRey = (casillasComprobadas = []) => {
    casillasComprobadas.forEach((casilla, index) => {
        if (casilla.classList.contains("futuroDestinoPosible")) {//Si el destino no es seguro para el rey lo elimino de posibles destinos
            casillasComprobadas.splice(index, 1)
        }
    })
    return casillasComprobadas

}


controladorCasillasPosibles = (pieza) => {
    casillasPosiblesVacias = []
    casillasPosiblesEnemigas = []
    piezaEnemiga = turnoBlancas ? "piezaNegra" : "piezaBlanca" //condicional ternario para qué pieza es la enemiga en cada turno
    posicionPiezaSeleccionada = posicionPieza(pieza)
    if (pieza.textContent === pawn) {//Peón
        if (turnoBlancas) {
            posicionBasePeon = 6
            movimientoFrontal = -1
        } else {
            posicionBasePeon = 1
            movimientoFrontal = 1
        }
        movimientoPeon(piezaEnemiga, posicionBasePeon, movimientoFrontal)
    } else if (pieza.textContent === rook) {//Torre
        //Movimientos Laterales/frontales
        movimientoLineal(piezaEnemiga, 1, 0)
        movimientoLineal(piezaEnemiga, -1, 0)
        movimientoLineal(piezaEnemiga, 0, 1)
        movimientoLineal(piezaEnemiga, 0, -1)
    } else if (pieza.textContent === knight) {//Caballo
        movimientoCaballo(piezaEnemiga, 2, 1)
        movimientoCaballo(piezaEnemiga, 2, -1)
        movimientoCaballo(piezaEnemiga, -2, 1)
        movimientoCaballo(piezaEnemiga, -2, -1)
        movimientoCaballo(piezaEnemiga, 1, 2)
        movimientoCaballo(piezaEnemiga, 1, -2)
        movimientoCaballo(piezaEnemiga, -1, 2)
        movimientoCaballo(piezaEnemiga, -1, -2)
    } else if (pieza.textContent === bishop) {//Alfil
        //Movimientos diagonales
        movimientoLineal(piezaEnemiga, 1, 1)
        movimientoLineal(piezaEnemiga, 1, -1)
        movimientoLineal(piezaEnemiga, -1, -1)
        movimientoLineal(piezaEnemiga, -1, 1)
    } else if (pieza.textContent === queen) {//Reina
        //Movimientos laterales/frontales
        movimientoLineal(piezaEnemiga, 1, 0)
        movimientoLineal(piezaEnemiga, -1, 0)
        movimientoLineal(piezaEnemiga, 0, 1)
        movimientoLineal(piezaEnemiga, 0, -1)
        //Movimientos diagonales
        movimientoLineal(piezaEnemiga, 1, 1)
        movimientoLineal(piezaEnemiga, 1, -1)
        movimientoLineal(piezaEnemiga, -1, -1)
        movimientoLineal(piezaEnemiga, -1, 1)
    } else if (pieza.textContent === king) {//Rey
        //Movimientos laterales/frontales
        movimientoLineal(piezaEnemiga, 1, 0, true, true)
        movimientoLineal(piezaEnemiga, -1, 0, true, true)
        movimientoLineal(piezaEnemiga, 0, 1, true, true)
        movimientoLineal(piezaEnemiga, 0, -1, true, true)
        //Movimientos diagonales
        movimientoLineal(piezaEnemiga, 1, 1, true, true)
        movimientoLineal(piezaEnemiga, 1, -1, true, true)
        movimientoLineal(piezaEnemiga, -1, -1, true, true)
        movimientoLineal(piezaEnemiga, -1, 1, true, true)
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
        moverPieza(casilla)
    }

}


//*LISTENERS
document.addEventListener("DOMContentLoaded", cargarPiezas)
document.addEventListener("click", controladorJuego)