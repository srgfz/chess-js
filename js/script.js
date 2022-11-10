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
let piezaEnemiga = "piezaNegra"//Irá cambiando con el turno
let jaque = false//Indicará si el rey está en jaque
let jaqueMate = false//Indicará el final de la partida
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

const encontrarCasillaRey = () => {
    let casillaRey
    casillas.forEach((fila) => {
        fila.forEach((casilla) => {
            if (casilla.textContent === king && casilla.classList.contains(piezaEnemiga === "piezaBlanca" ? "piezaNegra" : "piezaBlanca")) {
                casillaRey = casilla
            }
        })
    })
    return casillaRey
}

const posicionPieza = (pieza) => {
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

const seleccionarPieza = (pieza = null) => {
    //Borro la clase de todas las casillas menos la casilla que ya lo estaba para hacer el toggle
    casillas.forEach(fila => {
        fila.forEach(casilla => {
            if (casilla.textContent === "\u{25CF}") {//Desmarco los puntos de las casillas posibles vacías
                casilla.textContent = ""
            }
            if (pieza !== casilla) {//Reseteo las clases de las casillas que no he pulsado
                casilla.classList.remove("seleccionada")
                casilla.classList.remove("posibleDestinoVacio")
                casilla.classList.remove("posibleDestinoRival")
                casilla.classList.remove("futuroDestinoPosible")
            } else {//Guardo la casilla seleccionada
                piezaSeleccionada = casilla
            }
        })
    })
    //Marco/desmarco la pieza seleccionada
    if (pieza !== null) {
        pieza.classList.toggle("seleccionada")
    }
}

const marcarPosicionesPosibles = (casillasPosiblesVacias, casillasPosiblesEnemigas) => {
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

const desmarcarPosicionesPosiblesRey = (casillasEnJaque, casillasEnJaqueTrasComer) => {
    casillasEnJaque.forEach(casilla => {
        casilla.classList.remove("posibleDestinoVacio")
        casilla.textContent = ""
    })
    casillasEnJaqueTrasComer.forEach(casilla => {
        casilla.classList.remove("posibleDestinoRival")
    })
}

const moverPieza = (destino) => {
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
        piezaEnemiga = "piezaBlanca"
    } else {
        casillaDestino.classList.remove("piezaBlanca")
        casillaDestino.classList.add("piezaNegra")
        casillaOrigen.classList.remove("piezaNegra")
        turnoBlancas = true
        piezaEnemiga = "piezaNegra"
    }
    seleccionarPieza()//Reseteo las clases de las casillas
    comprobarJaque()
}

const comprobarJaque = () => {
    jaque = false
    let posicionRey = posicionPieza(encontrarCasillaRey())
    let piezaProvocaJaque = []
    let piezasDefenderAlRey = []//[posicionesPosibles], [casillaQuePuedeDefender]
    let piezasEnPeligro = comprobarPiezasEnPeligro()//Guardo todas las piezas que están en peligro
    piezasEnPeligro.map(piezas => {
        if (piezas[0].some((pieza) => pieza.textContent === king)) {//Si una pieza de las que está en peligro es el rey se producirá el jaque
            jaque = true
            piezaProvocaJaque.push(piezas[1], piezas[2])//Guardo la posición que provoca el jaque [1] y la pieza que es [2]
        }
    })
    if (jaque) {
        let distanciaFrontal = 0, distanciaLateral = 0
        comprobarJaqueMate()
        if (piezaProvocaJaque.length <= 2) {//Si es solo una pieza la que amenaza al rey 
            //*TODO: tengo la pieza que amenaza al rey, su posción y la posición del rey --> distancia de la pieza que amenaza y el rey
            //*Tengo que guardar tanto las piezas que se pueden mover como las casillas a las que se pueden mover para proteger al rey
            distanciaFrontal = piezaProvocaJaque[0][0] - posicionRey[0]
            distanciaLateral = piezaProvocaJaque[0][1] - posicionRey[1]
            //*Calcular la distancia en movimiento frontal y en el movimiento lateral de la casilla que amenaza (piezaProvocaJaque[0]) con la casilla del rey (posicionRey)
            if (piezaProvocaJaque[2] === rook) {//La pieza que amenaza al rey es un peón
                //*TODO: ver si alguna pieza tiene en posibles casillas vacias la ruta del rival
            } else if (piezaProvocaJaque[2] === bishop) {//La pieza que amenaza al rey es un alfil

            } else if (piezaProvocaJaque[2] === queen) {//La pieza que amenaza al rey es la reina

            }
            piezasDefenderAlRey.push(comerPiezaProvocaJaque(piezaProvocaJaque[0]))//Guardo las posiciones que pueden comerse a la pieza que amenaza al rey
        } else {//si hay más de una pieza que provoca amenaza al rey, ninguna pieza podrá defenderlo, solo podrá mover al rey para escapar del jaque
            piezasDefenderAlRey.push([king])//Lo paso como array para que todos los elementos tengan la misma estructura
        }
    }
    console.log(jaque)
    console.log(piezaProvocaJaque)
    console.log(piezasDefenderAlRey)
}

const comerPiezaProvocaJaque = (posicionAComer) => {
    let casillasPosiblesDefenderRey = comprobarPiezasObjetivo()
    comprobarPiezasObjetivo().map(arraysObjetivos => {
        arraysObjetivos.map(objetivo => {
            if (objetivo[0] === posicionAComer) {//Si la pieza puede comer la posición que amenaza al rey
                casillasPosiblesDefenderRey.push(objetivo[0], objetivo[1])//En [0] guardo la posición que me puedo comer y en [1] la casilla de la pieza que puede hacer el movimiento
            }
        })
    })
    return casillasPosiblesDefenderRey
}

const comprobarJaqueMate = () => {

}

const error = (casilla) => {
    casilla.classList.add("error")
    setTimeout(() => casilla.classList.remove("error"), 500)
}

const comprobarCasillaExiste = (movimientoFrontal = 0, movimientoLateral = 0, posicionOrigen = posicionPiezaSeleccionada) => {
    let casillaExiste = false
    if ((posicionOrigen[0] + movimientoFrontal <= 7) && (posicionOrigen[0] + movimientoFrontal >= 0) && (posicionOrigen[1] + movimientoLateral <= 7) && (posicionOrigen[1] + movimientoLateral >= 0)) {//Si la casilla está dentro del tablero, existe
        casillaExiste = true
    }
    return casillaExiste
}

const movimientoPeon = (posicionBase, movimientoFrontal, posicionOrigen = posicionPiezaSeleccionada, piezaRival = piezaEnemiga, casillasPosiblesVacias = [], casillasPosiblesEnemigas = []) => {
    if (comprobarCasillaExiste(movimientoFrontal, movimientoLateral = 0, posicionOrigen)) {//Si la casilla a comprobar existe
        casillaComprobar = casillas[posicionOrigen[0] + movimientoFrontal][posicionOrigen[1]]
        if (casillaComprobar.textContent === "" || casillaComprobar.textContent === "\u{25CF}") {//Si la posición no contiene ninguna pieza
            casillasPosiblesVacias.push(casillaComprobar)
            if (posicionOrigen[0] === posicionBase && casillas[posicionOrigen[0] + movimientoFrontal * 2][posicionOrigen[1]].textContent === "") {//Si el peón está en la posición de inicio y la siguiente también está vacía puede avanzar 2 posiciones
                casillasPosiblesVacias.push(casillas[posicionOrigen[0] + movimientoFrontal * 2][posicionOrigen[1]])
            }
        }
        if (comprobarCasillaExiste(movimientoFrontal, 1, posicionOrigen) && casillaComprobar.nextElementSibling.classList.contains(piezaRival)) {//Si existe la casilla diagonal derecha y tiene una pieza enemiga
            casillasPosiblesEnemigas.push(casillaComprobar.nextElementSibling)
        }
        if (comprobarCasillaExiste(movimientoFrontal, -1, posicionOrigen) && casillaComprobar.previousElementSibling.classList.contains(piezaRival)) {//Si existe la casilla diagonal Izq y tiene una pieza enemiga
            casillasPosiblesEnemigas.push(casillaComprobar.previousElementSibling)
        }
    }
    return [casillasPosiblesVacias, casillasPosiblesEnemigas]
}

const movimientoLineal = (movimientoFrontal, movimientoLateral, posicionOrigen = posicionPiezaSeleccionada, piezaRival = piezaEnemiga, casillasPosiblesVacias = [], casillasPosiblesEnemigas = []) => {
    posicionDisponible = true
    while (posicionDisponible && comprobarCasillaExiste(movimientoFrontal, movimientoLateral, posicionOrigen)) {//Mientras no encuentre una casilla ocupada y la casilla exista en el tablero
        casillaComprobar = casillas[posicionOrigen[0] + movimientoFrontal][posicionOrigen[1] + movimientoLateral]
        if (casillaComprobar.textContent === "" || casillaComprobar.textContent === "\u{25CF}") {//Si la posición no contiene ninguna pieza
            casillasPosiblesVacias.push(casillaComprobar)
        } else {//Si no está vacía será la última casilla que comprobará
            posicionDisponible = false
            if (casillaComprobar.classList.contains(piezaRival)) {//Si contiene una pieza enemiga
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
    return [casillasPosiblesVacias, casillasPosiblesEnemigas]
}

const movimientoCaballo = (movimientoFrontal, movimientoLateral, posicionOrigen = posicionPiezaSeleccionada, piezaRival = piezaEnemiga, casillasPosiblesVacias = [], casillasPosiblesEnemigas = []) => {
    if (comprobarCasillaExiste(movimientoFrontal, movimientoLateral, posicionOrigen)) {
        casillaComprobar = casillas[posicionOrigen[0] + movimientoFrontal][posicionOrigen[1] + movimientoLateral]
        if (casillaComprobar.textContent === "" || casillaComprobar.textContent === "\u{25CF}") {//Si la casilla no contiene ninguna pieza
            casillasPosiblesVacias.push(casillaComprobar)
        } else if (casillaComprobar.classList.contains(piezaRival)) {//Si la casilla tiene una pieza enemiga
            casillasPosiblesEnemigas.push(casillaComprobar)
        }
    }
    return [casillasPosiblesVacias, casillasPosiblesEnemigas]
}

const movimientoLinealUnitario = (movimientoFrontal, movimientoLateral, posicionOrigen = posicionPiezaSeleccionada, piezaRival = piezaEnemiga, casillasPosiblesVacias = [], casillasPosiblesEnemigas = []) => {
    if (comprobarCasillaExiste(movimientoFrontal, movimientoLateral, posicionOrigen)) {//Mientras no encuentre una casilla ocupada y la casilla exista en el tablero
        casillaComprobar = casillas[posicionOrigen[0] + movimientoFrontal][posicionOrigen[1] + movimientoLateral]
        if (casillaComprobar.textContent === "" || casillaComprobar.textContent === "\u{25CF}") {//Si la posición no contiene ninguna pieza
            casillasPosiblesVacias.push(casillaComprobar)
        } else {
            if (casillaComprobar.classList.contains(piezaRival)) {//Si contiene una pieza enemiga
                casillasPosiblesEnemigas.push(casillaComprobar)
            }
        }
    }
    return [casillasPosiblesVacias, casillasPosiblesEnemigas]
}

const comprobarPiezasEnPeligro = () => {
    let posicionComprobar
    let piezasEnPeligro = []//Arrays con piezas propias que están en peligro en el siguiente turno (para comprobar si hay jaque al rey) y la posición y pieza que las amenaza
    //Recorro todo el tablero buscando piezas Enemigas para comprobar sus posibles movimientos en el siguiente turno
    casillas.forEach(fila => {
        fila.forEach(casilla => {//Marco todos los posibles movimientos enemigos del proximo turno con la clase ".futuroDestinoPosible"
            if (casilla.classList.contains(piezaEnemiga)) {//Si la casilla tiene una pieza enemiga
                posicionComprobar = posicionPieza(casilla)//Actualizo la posición de la pieza seleccionada a la pieza de la que voy a ir haciendo la comprobación
                if (casilla.textContent === pawn) {//comprobación del peon
                    movimientoFrontal = turnoBlancas ? 1 : -1 //Dirección de los peones según la pieza que se trate: será la inversa a la real ya que estoy comprobando el siguiente turno
                    piezasEnPeligro.push([movimientoLinealUnitario(movimientoFrontal, 1, posicionComprobar, piezaEnemiga === "piezaBlanca" ? "piezaNegra" : "piezaBlanca")[1], posicionComprobar, casilla.textContent])
                    piezasEnPeligro.push([movimientoLinealUnitario(movimientoFrontal, -1, posicionComprobar, piezaEnemiga === "piezaBlanca" ? "piezaNegra" : "piezaBlanca")[1], posicionComprobar, casilla.textContent])
                } else if (casilla.textContent === knight) {//Posible Jaque del Caballo
                    for (let i = -2; i <= 2; i++) {
                        for (let j = 2; j >= -2; j--) {
                            if (i !== 0 && j !== 0 && i !== j && i + j !== 0) {
                                piezasEnPeligro.push([movimientoCaballo(i, j, posicionComprobar, piezaEnemiga === "piezaBlanca" ? "piezaNegra" : "piezaBlanca")[1], posicionComprobar, casilla.textContent])
                            }
                        }
                    }
                } else if (casilla.textContent === rook) {//Posible Jaque de la torre
                    for (let i = -1; i <= 1; i++) {
                        for (let j = 1; j >= -1; j--) {
                            if (!(i === 0 && j === 0) && i !== j && (j === 0 || i === 0)) {
                                piezasEnPeligro.push([movimientoLineal(i, j, posicionComprobar, piezaEnemiga === "piezaBlanca" ? "piezaNegra" : "piezaBlanca")[1], posicionComprobar, casilla.textContent])
                            }
                        }
                    }
                } else if (casilla.textContent === bishop) {//comprobación del alfil
                    for (let i = -1; i <= 1; i++) {
                        for (let j = 1; j >= -1; j--) {
                            if (i !== 0 && j !== 0) {
                                piezasEnPeligro.push([movimientoLineal(i, j, posicionComprobar, piezaEnemiga === "piezaBlanca" ? "piezaNegra" : "piezaBlanca")[1], posicionComprobar, casilla.textContent])
                            }
                        }
                    }
                } else if (casilla.textContent === queen) {//comprobación de la reina
                    for (let i = -1; i <= 1; i++) {
                        for (let j = 1; j >= -1; j--) {
                            if (!(i === 0 && j === 0)) {
                                piezasEnPeligro.push([movimientoLineal(i, j, posicionComprobar, piezaEnemiga === "piezaBlanca" ? "piezaNegra" : "piezaBlanca")[1], posicionComprobar, casilla.textContent])
                            }
                        }
                    }
                } else if (casilla.textContent === king) {//comprobación del rey
                    for (let i = -1; i <= 1; i++) {
                        for (let j = 1; j >= -1; j--) {
                            if (!(i === 0 && j === 0)) {
                                piezasEnPeligro.push([movimientoLinealUnitario(i, j, posicionComprobar, piezaEnemiga === "piezaBlanca" ? "piezaNegra" : "piezaBlanca")[1], posicionComprobar, casilla.textContent])
                            }
                        }
                    }
                }
            }
        })
    })
    return piezasEnPeligro
}

const comprobarPiezasObjetivo = () => {
    let posicionComprobar
    let piezasObjetivo = []//Arrays con piezas propias que están en peligro en el siguiente turno (para comprobar si hay jaque al rey) y la posición y pieza que las amenaza
    //Recorro todo el tablero buscando piezas Enemigas para comprobar sus posibles movimientos en el siguiente turno
    casillas.forEach(fila => {
        fila.forEach(casilla => {//Marco todos los posibles movimientos enemigos del proximo turno con la clase ".futuroDestinoPosible"
            if (casilla.classList.contains(piezaEnemiga === "piezaBlanca" ? "piezaNegra" : "piezaBlanca")) {//Si la casilla tiene una pieza enemiga
                posicionComprobar = posicionPieza(casilla)//Actualizo la posición de la pieza seleccionada a la pieza de la que voy a ir haciendo la comprobación
                if (casilla.textContent === pawn) {//comprobación del peon
                    movimientoFrontal = turnoBlancas ? 1 : -1 //Dirección de los peones según la pieza que se trate: será la inversa a la real ya que estoy comprobando el siguiente turno
                    piezasObjetivo.push([movimientoLinealUnitario(movimientoFrontal, 1, posicionComprobar)[1], posicionComprobar, casilla.textContent])
                    piezasObjetivo.push([movimientoLinealUnitario(movimientoFrontal, -1, posicionComprobar)[1], posicionComprobar, casilla.textContent])
                } else if (casilla.textContent === knight) {//Posible Jaque del Caballo
                    for (let i = -2; i <= 2; i++) {
                        for (let j = 2; j >= -2; j--) {
                            if (i !== 0 && j !== 0 && i !== j && i + j !== 0) {
                                piezasObjetivo.push([movimientoCaballo(i, j, posicionComprobar)[1], posicionComprobar, casilla.textContent])
                            }
                        }
                    }
                } else if (casilla.textContent === rook) {//Posible Jaque de la torre
                    for (let i = -1; i <= 1; i++) {
                        for (let j = 1; j >= -1; j--) {
                            if (!(i === 0 && j === 0) && i !== j && (j === 0 || i === 0)) {
                                piezasObjetivo.push([movimientoLineal(i, j, posicionComprobar)[1], posicionComprobar, casilla.textContent])
                            }
                        }
                    }
                } else if (casilla.textContent === bishop) {//comprobación del alfil
                    for (let i = -1; i <= 1; i++) {
                        for (let j = 1; j >= -1; j--) {
                            if (i !== 0 && j !== 0) {
                                piezasObjetivo.push([movimientoLineal(i, j, posicionComprobar)[1], posicionComprobar, casilla.textContent])
                            }
                        }
                    }
                } else if (casilla.textContent === queen) {//comprobación de la reina
                    for (let i = -1; i <= 1; i++) {
                        for (let j = 1; j >= -1; j--) {
                            if (!(i === 0 && j === 0)) {
                                piezasObjetivo.push([movimientoLineal(i, j, posicionComprobar)[1], posicionComprobar, casilla.textContent])
                            }
                        }
                    }
                } else if (casilla.textContent === king) {//comprobación del rey
                    for (let i = -1; i <= 1; i++) {
                        for (let j = 1; j >= -1; j--) {
                            if (!(i === 0 && j === 0)) {
                                piezasObjetivo.push([movimientoLinealUnitario(i, j, posicionComprobar)[1], posicionComprobar, casilla.textContent])
                            }
                        }
                    }
                }
            }
        })
    })
    return piezasObjetivo
}


const comprobarCasillasJaqueAlRey = () => {
    let posicionComprobar
    let casillasEnJaqueVacias = []
    let casillasEnJaqueRivales = []
    //Recorro todo el tablero buscando piezas Enemigas para comprobar sus posibles movimientos en el siguiente turno
    casillas.forEach(fila => {
        fila.forEach(casilla => {//Marco todos los posibles movimientos enemigos del proximo turno con la clase ".futuroDestinoPosible"
            if (casilla.classList.contains(piezaEnemiga)) {//Si la casilla tiene una pieza enemiga
                posicionComprobar = posicionPieza(casilla)//Actualizo la posición de la pieza seleccionada a la pieza de la que voy a ir haciendo la comprobación
                if (casilla.textContent === pawn) {//comprobación del peon
                    movimientoFrontal = turnoBlancas ? 1 : -1 //Dirección de los peones según la pieza que se trate: será la inversa a la real ya que estoy comprobando el siguiente turno
                    casillasEnJaqueVacias = movimientoLinealUnitario(movimientoFrontal, 1, posicionComprobar)[0]
                    casillasEnJaqueRivales = movimientoLinealUnitario(movimientoFrontal, 1, posicionComprobar)[1]
                    desmarcarPosicionesPosiblesRey(casillasEnJaqueVacias, casillasEnJaqueRivales)
                    casillasEnJaqueVacias = movimientoLinealUnitario(movimientoFrontal, -1, posicionComprobar)[0]
                    casillasEnJaqueRivales = movimientoLinealUnitario(movimientoFrontal, -1, posicionComprobar)[1]
                    desmarcarPosicionesPosiblesRey(casillasEnJaqueVacias, casillasEnJaqueRivales)
                } else if (casilla.textContent === knight) {//Posible Jaque del Caballo
                    for (let i = -2; i <= 2; i++) {
                        for (let j = 2; j >= -2; j--) {
                            if (i !== 0 && j !== 0 && i !== j && i + j !== 0) {
                                casillasEnJaqueVacias = movimientoCaballo(i, j, posicionComprobar)[0]
                                casillasEnJaqueRivales = movimientoCaballo(i, j, posicionComprobar)[1]
                                desmarcarPosicionesPosiblesRey(casillasEnJaqueVacias, casillasEnJaqueRivales)
                            }
                        }
                    }
                } else if (casilla.textContent === rook) {//Posible Jaque de la torre
                    for (let i = -1; i <= 1; i++) {
                        for (let j = 1; j >= -1; j--) {
                            if (!(i === 0 && j === 0) && i !== j && (j === 0 || i === 0)) {
                                casillasEnJaqueVacias = movimientoLineal(i, j, posicionComprobar)[0]
                                casillasEnJaqueRivales = movimientoLineal(i, j, posicionComprobar)[1]
                                desmarcarPosicionesPosiblesRey(casillasEnJaqueVacias, casillasEnJaqueRivales)
                            }
                        }
                    }
                } else if (casilla.textContent === bishop) {//comprobación del alfil
                    for (let i = -1; i <= 1; i++) {
                        for (let j = 1; j >= -1; j--) {
                            if (i !== 0 && j !== 0) {
                                casillasEnJaqueVacias = movimientoLineal(i, j, posicionComprobar)[0]
                                casillasEnJaqueRivales = movimientoLineal(i, j, posicionComprobar)[1]
                                desmarcarPosicionesPosiblesRey(casillasEnJaqueVacias, casillasEnJaqueRivales)
                            }
                        }
                    }
                } else if (casilla.textContent === queen) {//comprobación de la reina
                    for (let i = -1; i <= 1; i++) {
                        for (let j = 1; j >= -1; j--) {
                            if (!(i === 0 && j === 0)) {
                                casillasEnJaqueVacias = movimientoLineal(i, j, posicionComprobar)[0]
                                casillasEnJaqueRivales = movimientoLineal(i, j, posicionComprobar)[1]
                                desmarcarPosicionesPosiblesRey(casillasEnJaqueVacias, casillasEnJaqueRivales)
                            }
                        }
                    }
                } else if (casilla.textContent === king) {//comprobación del rey
                    for (let i = -1; i <= 1; i++) {
                        for (let j = 1; j >= -1; j--) {
                            if (!(i === 0 && j === 0)) {
                                casillasEnJaqueVacias = movimientoLinealUnitario(i, j, posicionComprobar)[0]
                                casillasEnJaqueRivales = movimientoLinealUnitario(i, j, posicionComprobar)[1]
                                desmarcarPosicionesPosiblesRey(casillasEnJaqueVacias, casillasEnJaqueRivales)
                            }
                        }
                    }
                }
            }
        })
    })
}


const controladorCasillasPosibles = (pieza) => {
    posicionPiezaSeleccionada = posicionPieza(pieza)
    casillasPosiblesVacias = []
    casillasPosiblesRivales = []
    if (pieza.textContent === pawn) {//Peón
        if (turnoBlancas) {
            posicionBasePeon = 6
            movimientoFrontal = -1
        } else {
            posicionBasePeon = 1
            movimientoFrontal = 1
        }
        casillasPosiblesVacias = movimientoPeon(posicionBasePeon, movimientoFrontal)[0]
        casillasPosiblesRivales = movimientoPeon(posicionBasePeon, movimientoFrontal)[1]
        marcarPosicionesPosibles(casillasPosiblesVacias, casillasPosiblesRivales)
    } else if (pieza.textContent === rook) {//Torre
        //Movimientos Laterales/frontales
        for (let i = -1; i <= 1; i++) {
            for (let j = 1; j >= -1; j--) {
                if (!(i === 0 && j === 0) && i !== j && (j === 0 || i === 0)) {
                    casillasPosiblesVacias = movimientoLineal(i, j)[0]
                    casillasPosiblesRivales = movimientoLineal(i, j)[1]
                    marcarPosicionesPosibles(casillasPosiblesVacias, casillasPosiblesRivales)
                }
            }
        }
    } else if (pieza.textContent === knight) {//Caballo
        for (let i = -2; i <= 2; i++) {
            for (let j = 2; j >= -2; j--) {
                if (i !== 0 && j !== 0 && i !== j && i + j !== 0) {
                    casillasPosiblesVacias = movimientoCaballo(i, j)[0]
                    casillasPosiblesRivales = movimientoCaballo(i, j)[1]
                    marcarPosicionesPosibles(casillasPosiblesVacias, casillasPosiblesRivales)
                }
            }
        }
    } else if (pieza.textContent === bishop) {//Alfil
        for (let i = -1; i <= 1; i++) {
            for (let j = 1; j >= -1; j--) {
                if (i !== 0 && j !== 0) {
                    casillasPosiblesVacias = movimientoLineal(i, j)[0]
                    casillasPosiblesRivales = movimientoLineal(i, j)[1]
                    marcarPosicionesPosibles(casillasPosiblesVacias, casillasPosiblesRivales)
                }
            }
        }
    } else if (pieza.textContent === queen) {//Reina
        for (let i = -1; i <= 1; i++) {
            for (let j = 1; j >= -1; j--) {
                if (!(i === 0 && j === 0)) {
                    casillasPosiblesVacias = movimientoLineal(i, j)[0]
                    casillasPosiblesRivales = movimientoLineal(i, j)[1]
                    marcarPosicionesPosibles(casillasPosiblesVacias, casillasPosiblesRivales)
                }
            }
        }
    } else if (pieza.textContent === king) {//Rey
        for (let i = -1; i <= 1; i++) {
            for (let j = 1; j >= -1; j--) {
                if (!(i === 0 && j === 0)) {
                    casillasPosiblesVacias = movimientoLinealUnitario(i, j)[0]
                    casillasPosiblesRivales = movimientoLinealUnitario(i, j)[1]
                    marcarPosicionesPosibles(casillasPosiblesVacias, casillasPosiblesRivales)
                }
            }
        }
        comprobarCasillasJaqueAlRey()
    }
}

const controladorJuego = (ev) => {
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