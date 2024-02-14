// Declara variables y arrays para almacenar ingresos, gastos y el balance
let ingresos = [];
let gastos = [];
let balance = 0;

// Función para registrar ingresos y gastos
function registrarMovimiento(tipo) {
    const cantidad = parseFloat(prompt(`Introduce el monto del ${tipo}:`));
    if (isNaN(cantidad)) {
        alert('Por favor, introduce un número válido.');
        return;
    }
    if (tipo === 'ingreso') {
        ingresos.push(cantidad);
    } else {
        gastos.push(cantidad);
    }
}

// Función para calcular el balance
function calcularBalance() {
    const totalIngresos = ingresos.reduce((acc, curr) => acc + curr, 0);
    const totalGastos = gastos.reduce((acc, curr) => acc + curr, 0);
    balance = totalIngresos - totalGastos;
}

// Función para mostrar el balance
function mostrarBalance() {
    console.log('Detalle de Ingresos:', ingresos);
    console.log('Detalle de Gastos:', gastos);
    alert(`Tu balance es: ${balance}.\nRevisa la consola para más detalles.`);
}

// Lógica principal
function iniciarSimulador() {
    let continuar = true;
    while (continuar) {
        const accion = prompt('¿Quieres registrar un ingreso, un gasto, o calcular tu balance? (ingreso/gasto/calcular)', 'ingreso');

        if (accion === 'ingreso' || accion === 'gasto') {
            registrarMovimiento(accion);
        } else if (accion === 'calcular') {
            calcularBalance();
            mostrarBalance();
            continuar = false;
        } else {
            alert('Por favor, introduce una acción válida.');
        }

        if (continuar) {
            continuar = confirm('¿Quieres realizar otra acción?');
        }
    }
}

// Iniciar el simulador
iniciarSimulador();