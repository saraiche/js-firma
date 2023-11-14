const canvas = document.querySelector('canvas');
const form = document.querySelector('.firma-pad-form');
const botonLimpiar = document.querySelector('.boton-limpiar');
const botonImagen = document.querySelector('.boton-imagen');
const botonContrato = document.querySelector('.boton-contrato');

//contexto del canvas para dibujar en 2d
const ctx = canvas.getContext('2d');
//bandera para ver si ya comenzamos a presionar el botón sin soltarlo
let modoEscritura = false;
//variables para guardar la posición del cursor
let xAnterior = 0, yAnterior = 0, xActual = 0, yActual = 0;
//variables de estilo
const COLOR = 'blue';
const GROSOR = 2;

//controla evento submit
form.addEventListener('submit', (e) => {
    //previene que se envie el formulario
    e.preventDefault();

    //borramos la imagen anterior
    const resultadoContenedor = document.querySelector('.firma-resultado-contenedor');
    const imagenAnterior = document.querySelector('.firma-imagen');
    if(imagenAnterior) {
        imagenAnterior.remove();
    }
    //crea la nueva imagen con lo que hay en el canvas
    const imagenURL = canvas.toDataURL();
    const imagen = document.createElement('img');
    imagen.src = imagenURL;
    imagen.height = canvas.height;
    imagen.width = canvas.width;
    imagen.classList.add('firma-imagen');
    //agregamos la imagen al html
    resultadoContenedor.appendChild(imagen);
    //limpia el canvas
    limpiarPad();
});

const limpiarPad = () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};
limpiarPad();

botonLimpiar.addEventListener('click', (e) => {
    e.preventDefault();
    limpiarPad();
});

//clic para descragar la imagen de firma
botonImagen.addEventListener('click', (e) => {
    e.preventDefault();

    const enlace = document.createElement('a');
    //titulo
    enlace.download = "Firma.png";
    //firma a base64
    enlace.href = canvas.toDataURL();
    enlace.click();
});

//funcion accedida por ventana hijo
window.obtenerImagen = () => {
    return canvas.toDataURL();
};

//impresion de contrato con su firma
botonContrato.addEventListener('click', (e) => {
    e.preventDefault();

    const ventana = window.open('contrato.html');
});

const obtenerPosicionCursor = (e) => {
    positionX = e.clientX - e.target.getBoundingClientRect().left;
    positionY = e.clientY - e.target.getBoundingClientRect().top;

    return[positionX, positionY];
}

//funcion cuando inicia el trazo
const OnClicOToqueIniciado = (e) => {
    modoEscritura = true;
    [xActual, yActual] = obtenerPosicionCursor(e);

    ctx.beginPath();
    ctx.fillStyle = COLOR;
    ctx.fillRect(xActual, yActual, GROSOR, GROSOR);
    ctx.closePath();
}

//al mover el dedo o mouse sin depejarlo dibujamos las líneas
const OnMouseODedoMovido = (e) => {
    if(!modoEscritura) return;

    let target = e;
    if(e.type.includes("touch"))
    {
        target = e.touches[0];
    }
    xAnterior = xActual;
    yAnterior = yActual;
    [xActual, yActual] = obtenerPosicionCursor(target);

    ctx.beginPath();
    ctx.lineWidth = GROSOR;
    ctx.strokeStyle = COLOR;
    ctx.moveTo(xAnterior, yAnterior);
    ctx.lineTo(xActual, yActual);
    ctx.stroke();
    ctx.closePath();
}

//al levantar el dedo
function OnClicODedoLevantado() {
    modoEscritura = false;
}

['mousedown', 'touchstart'].forEach(nombreEvento => {
    canvas.addEventListener(nombreEvento, OnClicOToqueIniciado, { passive: true});
});

['mousemove', 'touchmove'].forEach(nombreEvento => {
    canvas.addEventListener(nombreEvento, OnMouseODedoMovido, { passive: true});
});

['mouseup', 'touchend'].forEach(nombreEvento => {
    canvas.addEventListener(nombreEvento, OnClicODedoLevantado, { passive: true});
});