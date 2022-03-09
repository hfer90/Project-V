const monto = document.getElementById('monto');
const cuotas = document.getElementById('cuotas');
const generar = document.getElementById('generar');
const guardar = document.getElementById('guardar');
const cargar = document.getElementById('cargar');
const listaCuotas = document.querySelector('#listaTabla tbody');

function prestamo(monto, cuotas, tasa, valorCuota) {
    this.monto = parseInt(monto);
    this.cuotas = parseInt(cuotas);
    this.tasa = tasa;
    this.valorCuota = valorCuota;
}

var prestamo1 = new prestamo(50000, 12, 45, 0);

//todo lo de abajo se ejecuta despues que carguen todos los elementos de la pagina.
$(document).ready(function () {
    //asigna tasa segun cantidad de cuotas
    function calcularTasa() { 
        if (prestamo1.cuotas > 24) { prestamo1.tasa = 50; } else { prestamo1.tasa = 45; }
    }

    // esto elimina resultados anteriores, calcula el valor de la cuota, y con un for todas las
    // cuotas con su capital e interes
    // por ultimo lo carga en una tabla
    function calcularCuota(monto, cuotas, tasa) {

        while(listaCuotas.firstChild){
            listaCuotas.removeChild(listaCuotas.firstChild);
        }
    
        let fechas = [];
        let fechaActual = Date.now();
        let mes_actual = moment(fechaActual);
        mes_actual.add(1, 'month');    
    
        let interes = 0, capital = 0;
    
        prestamo1.valorCuota = parseFloat(monto * (Math.pow(1 + tasa / 100, cuotas) * tasa / 100) / (Math.pow(1 + tasa / 100, cuotas) - 1));
    
        for(let i = 1; i <= prestamo1.cuotas; i++) {
    
            interes = parseFloat(monto*(tasa / 100));
            capital = prestamo1.valorCuota - interes;
            monto = parseFloat(monto-capital);
    
            //Formato fechas
            fechas[i] = mes_actual.format('DD-MM-YYYY');
            mes_actual.add(1, 'month');
    
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${fechas[i]}</td>
                <td>${prestamo1.valorCuota.toFixed(2)}</td>
                <td>${capital.toFixed(2)}</td>
                <td>${interes.toFixed(2)}</td>
                <td>${monto.toFixed(2)}</td>
            `;
            listaCuotas.appendChild(row)
        }
    }

    //elimina resumen de result, y envia al dom una lista con datos
    function imprimirResultado() {
        $('.prestamoCalculado').remove();

        let items = [];

        let li = 
        ` <li class="prestamoCalculado"> Monto Solicitado: $${prestamo1.monto}</li> 
         <li class="prestamoCalculado"> Cantidad de cuotas: ${prestamo1.cuotas}</li> 
         <li class="prestamoCalculado"> Tasa asignada: ${prestamo1.tasa}%</li> 
         <li class="prestamoCalculado"> Valor de cada cuota: ${prestamo1.valorCuota.toFixed(2)}</li>
         `;

        items.push(li);
        
        $(".simulaciones").append(items);
    }

    // guarda en local storage los datos del prestamo generado
    function guardarPrestamo() {
        localStorage.setItem('producto1', JSON.stringify(prestamo1));
        alert("La simulación se guardó correctamente!");
    }

    //carga de local storage los datos y lo simula nuevamente
    function cargarPrestamo() {
        prestamo1 = JSON.parse(localStorage.getItem('producto1'));
    }

    //esta animacion oculta lo visible y visibiliza lo que estaba oculto (elementos seleccionados)
    function animacion() {
        $('.toggle, .resultado, .botones button').toggle('fast');
    }

    // evento que carga en producto1.monto lo que se escribe en el input monto en el momento
    $('#monto').on('input', () => {
        prestamo1.monto = $('#monto').val();
    });

    // evento que carga en producto1.cuotas lo que se selecciona en select cuotas en el momento
    $('#cuotas').on('input', () => {
        prestamo1.cuotas = $('#cuotas').val();
    });

    // evento que chequea min y max, luego ejecuta las funciones anteriores
    $('#generar').on('click', () => {
        if (monto.value >= 50000 && monto.value <= 500000){
            calcularTasa();
            calcularCuota(prestamo1.monto, prestamo1.cuotas, prestamo1.tasa / 12);
            imprimirResultado();
            animacion();
        } else {alert("Por favor ingrese correctamente monto y cuotas.")}
    });

    //evento click en boton guardar
    guardar.addEventListener('click', () => {
        guardarPrestamo();
    });

    //evento click en boton cargar, chequea si hay algo guardado o no
    cargar.addEventListener('click', () => {
        if (localStorage.length > 0) {
            cargarPrestamo();
            calcularCuota(prestamo1.monto, prestamo1.cuotas, prestamo1.tasa / 12);
            imprimirResultado();
            animacion();
        } else {alert("No posee simulaciones guardadas.");}
    });

    // evento click en boton volver
    $('#volver').on('click', () => {
        animacion();
    });

})
