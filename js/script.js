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

$(document).ready(function () {

    function calcularTasa() { 
        if (prestamo1.cuotas > 24) { prestamo1.tasa = 50; } else { prestamo1.tasa = 45; }
    }

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

    function guardarPrestamo() {
        localStorage.setItem('producto1', JSON.stringify(prestamo1));
        alert("La simulación se guardó correctamente!");
    }

    function cargarPrestamo() {
        prestamo1 = JSON.parse(localStorage.getItem('producto1'));
    }

    function animacion() {
        $('.toggle, .resultado, .botones button').toggle('fast');
    }

    $('#monto').on('input', () => {
        prestamo1.monto = $('#monto').val();
    });

    $('#cuotas').on('input', () => {
        prestamo1.cuotas = $('#cuotas').val();
    });

    $('#generar').on('click', () => {
        if (monto.value >= 50000 && monto.value <= 500000){
            calcularTasa();
            calcularCuota(prestamo1.monto, prestamo1.cuotas, prestamo1.tasa / 12);
            imprimirResultado();
            animacion();
        } else {alert("Por favor ingrese correctamente monto y cuotas.")}
    });

    guardar.addEventListener('click', () => {
        guardarPrestamo();
    });

    cargar.addEventListener('click', () => {
        if (localStorage.length > 0) {
            cargarPrestamo();
            calcularCuota(prestamo1.monto, prestamo1.cuotas, prestamo1.tasa / 12);
            imprimirResultado();
            animacion();
        } else {alert("No posee simulaciones guardadas.");}
    });

    $('#volver').on('click', () => {
        animacion();
    });

})
