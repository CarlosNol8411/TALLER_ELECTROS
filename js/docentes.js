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

    // Validación del número de control (debe comenzar con D)
    const controlNumberInput = document.getElementById('controlNumber');
    if (controlNumberInput) {
        controlNumberInput.addEventListener('blur', function() {
            if (this.value && !this.value.startsWith('D')) {
                this.setCustomValidity('El número de control para docentes debe comenzar con "D"');
                this.reportValidity();
            } else {
                this.setCustomValidity('');
            }
        });
    }

    // Manejo del formulario
    const teacherForm = document.getElementById('teacherForm');
    if (teacherForm) {
        teacherForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validar número de control
            const controlNumber = document.getElementById('controlNumber').value;
            if (!controlNumber.startsWith('D')) {
                alert('El número de control para docentes debe comenzar con "D"');
                return;
            }
            
            // Aquí iría la lógica para registrar el docente
            alert('Docente registrado exitosamente');
            
            // Limpiar el formulario
            e.target.reset();
            
            // Opcional: Cambiar a la pestaña de lista
            document.querySelector('.tab[data-tab="list"]').click();
            
            // Aquí podrías actualizar la tabla con el nuevo registro
        });
    }

    // Manejo de botones de acción en la tabla
    document.querySelectorAll('.btn-icon.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de eliminar este docente?')) {
                // Lógica para eliminar el docente
                const row = this.closest('tr');
                row.style.opacity = '0';
                setTimeout(() => {
                    row.remove();
                    // Aquí podrías hacer una petición al servidor para eliminar el registro
                }, 300);
            }
        });
    });

    // Manejo de botones de edición
    document.querySelectorAll('.btn-icon.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            // Lógica para editar el docente
            document.querySelector('.tab[data-tab="register"]').click();
            
            const row = this.closest('tr');
            const cells = row.querySelectorAll('td');
            
            // Llenar el formulario con los datos del docente
            document.getElementById('controlNumber').value = cells[0].textContent;
            document.getElementById('fullName').value = cells[1].textContent;
            
            // Cambiar el texto del botón de submit
            const submitBtn = teacherForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Docente';
            
            // Podrías agregar un campo oculto para el ID del docente si estás editando
        });
    });

    // Manejo de botones de asignación de materias
    document.querySelectorAll('.btn-icon.assign').forEach(btn => {
        btn.addEventListener('click', function() {
            // Aquí iría la lógica para redirigir o mostrar el módulo de asignación de materias
            alert('Funcionalidad de asignación de materias (se implementará después)');
        });
    });
});