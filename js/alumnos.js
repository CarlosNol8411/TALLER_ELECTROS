document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidad de pestañas
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover clase active de todas las pestañas y contenidos
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Agregar clase active a la pestaña clickeada
            tab.classList.add('active');
            
            // Mostrar el contenido correspondiente
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Manejo del formulario
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Aquí iría la lógica para registrar el alumno
            alert('Alumno registrado exitosamente');
            
            // Limpiar el formulario
            e.target.reset();
            
            // Opcional: Cambiar a la pestaña de lista
            document.querySelector('.tab[data-tab="list"]').click();
            
            // Aquí podrías actualizar la tabla con el nuevo registro
        });
    }

    // Ejemplo: Manejo de botones de acción en la tabla
    document.querySelectorAll('.btn-icon.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de eliminar este alumno?')) {
                // Lógica para eliminar el alumno
                const row = this.closest('tr');
                row.style.opacity = '0';
                setTimeout(() => {
                    row.remove();
                    // Aquí podrías hacer una petición al servidor para eliminar el registro
                }, 300);
            }
        });
    });

    // Ejemplo: Manejo de botones de edición
    document.querySelectorAll('.btn-icon.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            // Lógica para editar el alumno
            document.querySelector('.tab[data-tab="register"]').click();
            
            // Aquí podrías cargar los datos del alumno en el formulario
            const row = this.closest('tr');
            const cells = row.querySelectorAll('td');
            
            // Ejemplo de cómo podrías llenar el formulario
            document.getElementById('controlNumber').value = cells[0].textContent;
            
            // Separa nombre completo en partes (esto es un ejemplo simplificado)
            const fullName = cells[1].textContent.split(' ');
            document.getElementById('firstName').value = fullName[2] || ''; // Nombre
            document.getElementById('lastName').value = fullName[0] || ''; // Apellido Paterno
            document.getElementById('mothersLastName').value = fullName[1] || ''; // Apellido Materno
            
            // Semestre (extraer el número)
            const semesterText = cells[2].textContent;
            const semesterNumber = semesterText.match(/\d+/)[0];
            document.getElementById('semester').value = semesterNumber;
            
            // Carrera
            const careerText = cells[3].textContent;
            // Aquí necesitarías una lógica para mapear el texto al valor del select
            // Esto es solo un ejemplo simplificado
            if (careerText.includes('Sistemas')) {
                document.getElementById('career').value = 'ISC';
            }
            // Continuar con otras carreras...
            
            // Cambiar el texto del botón de submit
            const submitBtn = studentForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Alumno';
            
            // Podrías agregar un campo oculto para el ID del alumno si estás editando
        });
    });
});