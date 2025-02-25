export function validarNumeroCelular(numero) {
  // Expresión regular para validar el formato del número de celular ecuatoriano
  var patron = /^(?:\+593|0)?9\d{8}$/;

  // Verificar si el número coincide con el patrón
  if (patron.test(numero)) {
    return true; // El número es válido
  } else {
    return false; // El número no es válido
  }
}


export function validarCedula(cedula) {
  // Verificar si la longitud de la cédula es correcta
  if (cedula.length !== 10) {
    return false;
  }

  // Verificar que todos los caracteres sean dígitos numéricos
  if (!/^\d+$/.test(cedula)) {
    return false;
  }

  // Verificar el último dígito (dígito verificador)
  var digitoVerificador = parseInt(cedula.charAt(9));
  var suma = 0;
  var multi = 0;

  for (var i = 0; i < 9; i++) {
    var digito = parseInt(cedula.charAt(i));

    if (i % 2 === 0) {
      multi = digito * 2;
      if (multi > 9) {
        multi = multi - 9;
      }
    } else {
      multi = digito;
    }

    suma += multi;
  }

  var residuo = suma % 10;
  var resultado = residuo === 0 ? 0 : 10 - residuo;

  return resultado === digitoVerificador;
}

export function validarCorreoElectronico(correo) {
  // Expresión regular para validar el correo electrónico
  var patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Verificar si el correo coincide con el patrón
  return patron.test(correo);
}

export function isRangeTimeServicio(horaInicio,horaFin) {
  const inicioPermitido = "08:00:00"
  const finPermitido = "20:00:00"
  return horaInicio >= inicioPermitido && horaFin <= finPermitido
}


export function isRangeTimeServicioRangue(horaInicio,horaFin,r1,r2) {
  const inicioPermitido = r1
  const finPermitido = r2
  return horaInicio >= inicioPermitido && horaFin <= finPermitido
}