class CuentaBancaria {
    constructor(numeroCuenta, titular, tipo, saldoInicial = 0, activa = true) {
        this.numeroCuenta = numeroCuenta;
        this.titular = titular;
        this.tipo = tipo; 
        this.saldo = Number(saldoInicial);
        this.activa = activa;
    }

    depositar(monto) {
        if (monto > 0) {
            this.saldo += monto;
            return true;
        }
        return false;
    }

    extraer(monto) {
        if (monto > 0 && monto <= this.saldo) {
            this.saldo -= monto;
            return true;
        }
        return false;
    }
}