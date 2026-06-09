
const validators = {
    nombreCompleto: (value) => {
        if (value.length <= 6)
            return 'El nombre debe tener más de 6 caracteres.';
        const words = value.trim().split(/\s+/);
        if (words.length < 2)
            return 'Debe incluir nombre y apellido separados por un espacio.';
        return null;
    },
    email: (value) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            return 'Ingresá un email válido (ej: usuario@dominio.com).';
        return null;
    },
    contrasena: (value) => {
        if (value.length < 8)
            return 'La contraseña debe tener al menos 8 caracteres.';
        if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value))
            return 'La contraseña debe contener letras y números.';
        return null;
    },
    repetirContrasena: (value) => {
        const pass = document.getElementById('contrasena').value;
        if (value !== pass)
            return 'Las contraseñas no coinciden.';
        return null;
    },
    edad: (value) => {
        const n = parseInt(value, 10);
        if (isNaN(n) || !Number.isInteger(n) || n < 18)
            return 'La edad debe ser un número entero mayor o igual a 18.';
        return null;
    },
    telefono: (value) => {
        if (/[\s\-()]/.test(value))
            return 'El teléfono no puede contener espacios, guiones ni paréntesis.';
        if (!/^\d{7,}$/.test(value))
            return 'El teléfono debe tener al menos 7 dígitos numéricos.';
        return null;
    },
    direccion: (value) => {
        if (value.length < 5)
            return 'La dirección debe tener al menos 5 caracteres.';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9]+\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9]/.test(value))
            return 'La dirección debe tener letras, números y al menos un espacio.';
        return null;
    },
    ciudad: (value) => {
        if (value.length < 3)
            return 'La ciudad debe tener al menos 3 caracteres.';
        return null;
    },
    codigoPostal: (value) => {
        if (value.length < 3)
            return 'El código postal debe tener al menos 3 caracteres.';
        return null;
    },
    dni: (value) => {
        if (!/^\d{7,8}$/.test(value))
            return 'El DNI debe tener 7 u 8 dígitos numéricos.';
        return null;
    }
};
 
const fieldLabels = {
    nombreCompleto:    'Nombre Completo',
    email:             'Email',
    contrasena:        'Contraseña',
    repetirContrasena: 'Repetir Contraseña',
    edad:              'Edad',
    telefono:          'Teléfono',
    direccion:         'Dirección',
    ciudad:            'Ciudad',
    codigoPostal:      'Código Postal',
    dni:               'DNI'
};
 
const fields = Object.keys(validators);
 
function showError(fieldId, message) {
    const field    = document.getElementById(fieldId);
    const errorDiv = document.getElementById('error-' + fieldId);
    field.classList.add('error');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}
 
function clearError(fieldId) {
    const field    = document.getElementById(fieldId);
    const errorDiv = document.getElementById('error-' + fieldId);
    field.classList.remove('error');
    errorDiv.textContent = '';
    errorDiv.classList.remove('show');
}
 
function validateField(fieldId) {
    const value = document.getElementById(fieldId).value.trim();
 
    if (!value) {
        showError(fieldId, 'Este campo es obligatorio.');
        return false;
    }
 
    const error = validators[fieldId] ? validators[fieldId](value) : null;
    if (error) {
        showError(fieldId, error);
        return false;
    }
 
    clearError(fieldId);
    return true;
}
 
fields.forEach(function(fieldId) {
    const field = document.getElementById(fieldId);
 
    field.addEventListener('blur', function() {
        validateField(fieldId);
    });
 
    field.addEventListener('focus', function() {
        clearError(fieldId); 
    });
});
 

const nombreField  = document.getElementById('nombreCompleto');
const dynamicTitle = document.getElementById('dynamicTitle');
 
function updateTitle() {
    const nombre = nombreField.value.trim();
    dynamicTitle.textContent = nombre ? 'HOLA ' + nombre.toUpperCase() : 'HOLA';
}
 
nombreField.addEventListener('keydown', function() { setTimeout(updateTitle, 0); });
nombreField.addEventListener('input',   updateTitle);
nombreField.addEventListener('focus',   updateTitle);
 
const modal    = document.getElementById('modal');
const closeBtn = document.querySelector('.close');
 
closeBtn.onclick = function() { modal.style.display = 'none'; };
window.onclick   = function(e) { if (e.target === modal) modal.style.display = 'none'; };
 
document.getElementById('mainForm').addEventListener('submit', function(e) {
    e.preventDefault();
 
    var hasErrors = false;
    var errors    = [];
 
    fields.forEach(function(fieldId) {
        if (!validateField(fieldId)) {
            hasErrors = true;
            var errorMsg = document.getElementById('error-' + fieldId).textContent;
            errors.push(fieldLabels[fieldId] + ': ' + errorMsg);
        }
    });
 
    var modalTitle = document.getElementById('modalTitle');
    var modalBody  = document.getElementById('modalBody');
 
    if (hasErrors) {
        modalTitle.textContent = 'Errores en el Formulario';
        modalBody.innerHTML =
            '<div class="error-list">' +
                '<h3>Por favor, corregí los siguientes errores:</h3>' +
                '<ul>' + errors.map(function(e) { return '<li>' + e + '</li>'; }).join('') + '</ul>' +
            '</div>';
    } else {
        modalTitle.textContent = 'Formulario Enviado Correctamente';
        var formData = new FormData(this);
        var html = '';
        formData.forEach(function(value, key) {
            if (key === 'contrasena' || key === 'repetirContrasena') value = '••••••••';
            html +=
                '<div class="data-item">' +
                    '<div class="data-label">' + (fieldLabels[key] || key) + '</div>' +
                    '<div>' + value + '</div>' +
                '</div>';
        });
        modalBody.innerHTML = html;
    }
 
    modal.style.display = 'block';
});