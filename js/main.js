let banco = [];
let proximoNumeroCuenta = 1;
let cuentaActivaOperacion = null;

const contenedorItems = document.getElementById("contenedor-items");
const formCuenta = document.getElementById("form-cuenta");
const inputTitular = document.getElementById("input-titular");
const selectTipo = document.getElementById("select-tipo");
const inputSaldo = document.getElementById("input-saldo");
const inputBusqueda = document.getElementById("input-busqueda");
const totalReservasElemento = document.getElementById("total-reservas");

const modalOperacion = document.getElementById("modal-operacion");
const modalTitulo = document.getElementById("modal-titulo");
const modalSaldoActual = document.getElementById("modal-saldo-actual");
const inputMontoOperacion = document.getElementById("input-monto");
const btnDepositar = document.getElementById("btn-depositar");
const btnExtraer = document.getElementById("btn-extraer");
const btnCancelar = document.getElementById("btn-cancelar");

function mostrarNotificacion(mensaje, tipo = "exito") {
    const colores = {
        exito: "linear-gradient(to right, #16a34a, #22c55e)",
        error: "linear-gradient(to right, #b91c1c, #ef4444)",
        info: "linear-gradient(to right, #1e3a8a, #3b82f6)",
        alerta: "linear-gradient(to right, #ea580c, #f97316)"
    };

    Toastify({
        text: mensaje,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: colores[tipo],
            borderRadius: "6px",
            fontWeight: "500"
        }
    }).showToast();
}

const sincronizarStorage = () => {
    localStorage.setItem("banco_db_cuentas", JSON.stringify(banco));
};

const actualizarPatrimonio = () => {
    const patrimonio = banco.reduce((acc, cuenta) => acc + cuenta.saldo, 0);
    totalReservasElemento.textContent = `$${patrimonio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
};

function renderizarCuentas(listaRender) {
    contenedorItems.innerHTML = "";

    if (listaRender.length === 0) {
        contenedorItems.innerHTML = `<p class="mensaje-vacio">No existen registros que coincidan con la búsqueda.</p>`;
        return;
    }

    listaRender.forEach(cuenta => {
        const { numeroCuenta, titular, tipo, saldo, activa } = cuenta;
        const estadoClase = activa ? "cuenta-activa" : "cuenta-inactiva";
        const estadoTexto = activa ? "Activa" : "Inactiva";

        const tarjeta = document.createElement("div");
        tarjeta.className = `item-cuenta ${estadoClase}`;
        
        tarjeta.innerHTML = `
            <div class="cuenta-info">
                <h3>${titular}</h3>
                <p class="numero-cuenta">N° Cuenta: <strong>${numeroCuenta}</strong></p>
                <span class="etiqueta-tipo">${tipo}</span>
                <span class="estado-cuenta ${activa ? 'activa' : 'inactiva'}">${estadoTexto}</span>
                <p class="saldo-cuenta">$${saldo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div class="cuenta-acciones">
                <button class="btn btn-primary btn-operar" data-id="${numeroCuenta}">Operar</button>
                <button class="btn btn-danger btn-eliminar" data-id="${numeroCuenta}">Borrar</button>
            </div>
        `;
        contenedorItems.appendChild(tarjeta);
    });

    actualizarPatrimonio();
    asignarEventosTarjetas();
}

async function inicializarApp() {
    try {
        mostrarNotificacion("Sincronizando con el servidor...", "info");
        
        const datosStorage = JSON.parse(localStorage.getItem("banco_db_cuentas"));

        if (datosStorage && datosStorage.length > 0) {
            banco = datosStorage.map(c => new CuentaBancaria(c.numeroCuenta, c.titular, c.tipo, c.saldo, c.activa));
            mostrarNotificacion("Datos cargados desde almacenamiento local.", "exito");
        } else {
            const respuesta = await fetch("./data.json");
            if (!respuesta.ok) throw new Error("Error en la resolución del JSON");
            
            const datosFetch = await respuesta.json();
            banco = datosFetch.map(c => new CuentaBancaria(c.numeroCuenta, c.titular, c.tipo, c.saldo, c.activa));
            sincronizarStorage();
            mostrarNotificacion("Base de datos descargada correctamente.", "exito");
        }

        proximoNumeroCuenta = banco.length > 0 ? Math.max(...banco.map(c => c.numeroCuenta)) + 1 : 1;
        renderizarCuentas(banco);

    } catch (error) {
        mostrarNotificacion(`Error de conexión: ${error.message}`, "error");
        contenedorItems.innerHTML = `<p class="mensaje-vacio">El sistema no pudo recuperar los datos.</p>`;
    }
}

formCuenta.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const titular = inputTitular.value.trim();
    const tipo = selectTipo.value;
    const saldo = parseFloat(inputSaldo.value);

    if (titular === "" || isNaN(saldo) || saldo < 0) {
        mostrarNotificacion("Datos inválidos en el formulario.", "error");
        return;
    }

    const nuevaCuenta = new CuentaBancaria(proximoNumeroCuenta++, titular, tipo, saldo, true);
    banco.push(nuevaCuenta);
    
    sincronizarStorage();
    renderizarCuentas(banco);
    mostrarNotificacion("Cuenta habilitada exitosamente.", "exito");
    
    formCuenta.reset();
});

inputBusqueda.addEventListener("input", (e) => {
    const término = e.target.value.toLowerCase();
    renderizarCuentas(banco.filter(c => c.titular.toLowerCase().includes(término)));
});

document.getElementById("btn-todas")?.addEventListener("click", () => renderizarCuentas(banco));
document.getElementById("btn-corrientes")?.addEventListener("click", () => renderizarCuentas(banco.filter(c => c.tipo === "Cuenta Corriente")));
document.getElementById("btn-ahorro")?.addEventListener("click", () => renderizarCuentas(banco.filter(c => c.tipo === "Caja de Ahorro")));
document.getElementById("btn-activas")?.addEventListener("click", () => renderizarCuentas(banco.filter(c => c.activa)));
document.getElementById("btn-inactivas")?.addEventListener("click", () => renderizarCuentas(banco.filter(c => !c.activa)));

document.getElementById("btn-reset").addEventListener("click", () => {
    localStorage.clear();
    banco = [];
    inputBusqueda.value = "";
    mostrarNotificacion("Sistema purgado. Restaurando...", "alerta");
    inicializarApp(); 
});

function asignarEventosTarjetas() {
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            banco = banco.filter(c => c.numeroCuenta !== id); 
            sincronizarStorage();
            renderizarCuentas(banco);
            mostrarNotificacion(`Cuenta eliminada del registro.`, "error");
        });
    });

    document.querySelectorAll(".btn-operar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            const cuenta = banco.find(c => c.numeroCuenta === id); 
            
            if (cuenta && cuenta.activa) {
                cuentaActivaOperacion = cuenta;
                modalTitulo.textContent = `Operar: ${cuenta.titular}`;
                modalSaldoActual.textContent = `Saldo disponible: $${cuenta.saldo.toLocaleString('es-AR')}`;
                inputMontoOperacion.value = "";
                modalOperacion.classList.remove("oculto"); 
            } else {
                mostrarNotificacion("Esta cuenta se encuentra inactiva.", "error");
            }
        });
    });
}

const cerrarModal = () => {
    modalOperacion.classList.add("oculto");
    cuentaActivaOperacion = null;
};

btnCancelar.addEventListener("click", cerrarModal);

btnDepositar.addEventListener("click", () => {
    const monto = parseFloat(inputMontoOperacion.value);
    if (!isNaN(monto) && cuentaActivaOperacion.depositar(monto)) { 
        sincronizarStorage(); 
        renderizarCuentas(banco);
        mostrarNotificacion(`Depósito acreditado: $${monto}`, "exito");
        cerrarModal();
    } else {
        mostrarNotificacion("Monto inválido para depósito.", "error");
    }
});

btnExtraer.addEventListener("click", () => {
    const monto = parseFloat(inputMontoOperacion.value);
    if (isNaN(monto) || monto <= 0) {
        mostrarNotificacion("Ingrese un monto numérico válido.", "error");
    } else if (cuentaActivaOperacion.extraer(monto)) { 
        sincronizarStorage(); 
        renderizarCuentas(banco);
        mostrarNotificacion(`Extracción aprobada: $${monto}`, "alerta");
        cerrarModal();
    } else {
        mostrarNotificacion("Fondos insuficientes.", "error");
    }
});

// ==========================================
// MODO OSCURO (Dark Mode)
// ==========================================
const btnTheme = document.getElementById("btn-theme");

// Revisar si ya había una preferencia guardada al cargar
const temaGuardado = localStorage.getItem("tema_banco");
if (temaGuardado === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    btnTheme.textContent = "☀️ Modo Día";
}

btnTheme.addEventListener("click", () => {
    // Alternamos el atributo en la etiqueta html
    if (document.documentElement.getAttribute("data-theme") === "dark") {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("tema_banco", "light");
        btnTheme.textContent = "🌙 Modo Noche";
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("tema_banco", "dark");
        btnTheme.textContent = "☀️ Modo Día";
    }
});


inicializarApp();