var eliminarCaracteresEspeciales = (cadena) => {
    try {
        // Expresión regular que elimina cualquier cosa que no sea un carácter alfanumérico, espacio, o caracteres con tildes/ñ
        var regex = /[^\w\sáéíóúÁÉÍÓÚñÑüÜ]/g;
        // Reemplaza los caracteres especiales con una cadena vacía
        return cadena.replace(regex, '');
    } catch (e) {
        return cadena;
    }
}

var addGuionDni = (str) => {
    // Elimina los espacios
    str = str.replace(/\s+/g, '');

    // Verifica si el string ya tiene un guion
    if (str.includes('-')) {
        return str; // Si ya tiene guion, devuelve el string sin cambios
    } else {
        // Coloca el guion antes del último dígito
        return str.slice(0, -1) + '-' + str.slice(-1);
    }
}

var deleteGuionDni = (str) =>  {
    // Elimina los espacios
    str = str.replace(/\s+/g, '');

    // Verifica si el string ya tiene un guion
    if (str.includes('-')) {
        // Elimina el guion si está presente
        return str.replace('-', '');
    } else {
        return str; // Si no tiene guion, devuelve el string sin cambios
    }
}

var phoneNumer = (phone) => {
    // Verificar si el teléfono es nulo, indefinido o una cadena vacía
    if (!phone) {
        return null
    }

    // Eliminar cualquier espacio en blanco adicional
    phone = phone.trim();

    // Validar que sea un número de 9 dígitos, con o sin prefijo
    const ecuatorianPhoneRegex = /^(?:\+?593|0)?(9\d{8})$/;
    const match = phone.match(ecuatorianPhoneRegex);

    if (!match) {
        return null
    }

    // Extraer el número limpio
    const cleanPhone = match[1];

    // Retornar el número con el prefijo adecuado
    return `+593${cleanPhone}`;
}

module.exports = {eliminarCaracteresEspeciales,deleteGuionDni,addGuionDni,phoneNumer}