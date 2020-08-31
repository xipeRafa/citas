// Campos del formulario
const mascotaInput = q('#mascota')
const propietarioInput = q('#propietario')
const telefonoInput = q('#telefono')
const fechaInput = q('#fecha')
const horaInput = q('#hora')
const sintomasInput = q('#sintomas')

// UI
const formulario = q('#nueva-cita')
const contenedorCitas = q('#citas')

let editando

class Citas {
    constructor() {
        this.citas = []
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita]
    }

    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id !== id )
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita )
    }

}

class UI {

    imprimirAlerta(mensaje, tipo ) {
        // Crear el div
        const divMensaje = ce('div')
       

        // Agregar clase en base al tipo de error
        if(tipo === 'error') {
            divMensaje.classList.add('red')
        } else {
            divMensaje.classList.add('green')
        }

        // Mensaje de error
        divMensaje.textContent = mensaje

        // Agregar al DOM
        q('#alert').insertBefore(divMensaje, q('.agregar-cita'))

        // Quitar la alerta después de 5 segundos
        setTimeout( () => {
            divMensaje.remove()
        }, 5000 )  
    }


    imprimirCitas({citas}) {

        this.limpiarHTML()
       
        citas.forEach( cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita

            const divCita = ce('div')
            divCita.classList.add('btn_2')
            divCita.dataset.id = id

            // Scripting de los elementos de la cita
            const mascotaParrafo = ce('h2')
            mascotaParrafo.textContent = mascota

            const propietarioParrafo = ce('p')
            propietarioParrafo.innerHTML = `
                <span>Propietario: </span> ${propietario}
            `

            const telefonoParrafo = ce('p')
            telefonoParrafo.innerHTML = `
                <span>Teléfono: </span> ${telefono}
            `

            const fechaParrafo = ce('p')
            fechaParrafo.innerHTML = `
                <span>Fecha: </span> ${fecha}
            `

            const horaParrafo = ce('p')
            horaParrafo.innerHTML = `
                <span>Hora: </span> ${hora}
            `

            const sintomasParrafo = ce('p')
            sintomasParrafo.innerHTML = `
                <span>Síntomas: </span> ${sintomas}
            `

            // Boton para eliminar esta cita
            const btnEliminar = ce('button')
            btnEliminar.innerHTML = 'Eliminar'
            btnEliminar.onclick = () => eliminarCita(id)

            // Añade un botón para editar
            const btnEditar = ce('button')
            btnEditar.innerHTML = 'Editar'
            btnEditar.onclick = () => cargarEdicion(cita)
            

            // Agregar los parrafos al divCita
            divCita.appendChild(mascotaParrafo)
            divCita.appendChild(propietarioParrafo)
            divCita.appendChild(telefonoParrafo)
            divCita.appendChild(fechaParrafo)
            divCita.appendChild(horaParrafo)
            divCita.appendChild(sintomasParrafo)
            divCita.appendChild(btnEliminar)
            divCita.appendChild(btnEditar)
            
            // agregar las citas al HTML
            contenedorCitas.appendChild(divCita)
        } )
    }

    limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild( contenedorCitas.firstChild )
        }
    }
}

const ui = new UI()
const administrarCitas = new Citas()

// Registrar eventos
eventListeners()
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita)
    propietarioInput.addEventListener('input', datosCita)
    telefonoInput.addEventListener('input', datosCita)
    fechaInput.addEventListener('input', datosCita)
    horaInput.addEventListener('input', datosCita)
    sintomasInput.addEventListener('input', datosCita)

    formulario.addEventListener('submit', nuevaCita)
    
}

// Objeto con la información de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// Agrega datos al objeto de cita
function datosCita(e) {
    citaObj[e.target.name] = e.target.value
}


// Valida y agrega una nueva cita a la clase de citas
function nuevaCita(e) {
    e.preventDefault()
    
    // Extraer la información del objeto de cita
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj

    // validar de formulario
    if( mascota === '' || propietario === '' || telefono === '' || fecha === ''  || hora === '' || sintomas === '' ) {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error')

        return
    }

    if(editando) {
        ui.imprimirAlerta('Editado Correctamente')

        // Pasar el objeto de la cita a edición
        administrarCitas.editarCita({...citaObj})

        // regresar el texto del botón a su estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita'

        // Quitar modo edición
        editando = false
    } else {
        // generar un id único
        citaObj.id = Date.now()

        // Creando una nueva cita.
        administrarCitas.agregarCita({...citaObj})

        // Mensaje de agregado correctamente
        ui.imprimirAlerta('Se agregó correctamente')
    }



    // Reiniciar el objeto para la validación
    reiniciarObjeto()

    // Reiniciar el formulario
    formulario.reset()

    // Mostrar el HTML de las citas
    ui.imprimirCitas(administrarCitas)

}


function reiniciarObjeto() {
    citaObj.mascota = ''
    citaObj.propietario = ''
    citaObj.telefono = ''
    citaObj.fecha = ''
    citaObj.hora = ''
    citaObj.sintomas = ''
}


function eliminarCita(id) {
    // Eliminar la cita 
    administrarCitas.eliminarCita(id)

    // Muestre un mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente')

    // Refrescar las citas
    ui.imprimirCitas(administrarCitas)
}

// Carga los datos y el modo edición
function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita

    // Llenar los inputs
    mascotaInput.value = mascota
    propietarioInput.value = propietario
    telefonoInput.value = telefono
    fechaInput.value = fecha
    horaInput.value = hora
    sintomasInput.value = sintomas

    // Llenar el objeto
    citaObj.mascota = mascota
    citaObj.propietario = propietario
    citaObj.telefono = telefono
    citaObj.fecha = fecha
    citaObj.hora = hora
    citaObj.sintomas = sintomas
    citaObj.id = id


    // Cambiar el texto del botón
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios'

    editando = true

}