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

    // Búsqueda en la tabla
    const searchInput = document.getElementById('searchSubject');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.table tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Manejo del formulario
    const subjectForm = document.getElementById('subjectForm');
    if (subjectForm) {
        subjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validar datos del formulario
            const subjectCode = document.getElementById('subjectCode').value;
            const subjectName = document.getElementById('subjectName').value;
            const units = document.getElementById('units').value;
            const teacher = document.getElementById('teacher').value;
            
            if (!subjectCode || !subjectName || !units || !teacher) {
                alert('Por favor complete todos los campos requeridos');
                return;
            }
            
            // Aquí iría la lógica para registrar la materia
            alert('Materia registrada exitosamente');
            
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
            if (confirm('¿Estás seguro de eliminar esta materia?')) {
                // Lógica para eliminar la materia
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
            // Lógica para editar la materia
            document.querySelector('.tab[data-tab="register"]').click();
            
            const row = this.closest('tr');
            const cells = row.querySelectorAll('td');
            
            // Llenar el formulario con los datos de la materia
            document.getElementById('subjectCode').value = cells[0].textContent;
            document.getElementById('subjectName').value = cells[1].textContent;
            document.getElementById('units').value = cells[2].textContent;
            
            // Seleccionar el docente correspondiente
            const teacherName = cells[3].textContent;
            const teacherSelect = document.getElementById('teacher');
            for (let i = 0; i < teacherSelect.options.length; i++) {
                if (teacherSelect.options[i].text === teacherName) {
                    teacherSelect.selectedIndex = i;
                    break;
                }
            }
            
            // Cambiar el texto del botón de submit
            const submitBtn = subjectForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Materia';
            
            // Podrías agregar un campo oculto para el ID de la materia si estás editando
        });
    });

    // Manejo de botones de asignación
    document.querySelectorAll('.btn-icon.assign').forEach(btn => {
        btn.addEventListener('click', function() {
            // Cambiar a la pestaña de asignación
            document.querySelector('.tab[data-tab="assign"]').click();
            
            // Aquí podrías cargar los datos específicos de la materia para asignación
            const row = this.closest('tr');
            const subjectName = row.querySelector('td:nth-child(2)').textContent;
            
            // Mostrar información en el área de asignación
            const assignTab = document.getElementById('assign');
            assignTab.innerHTML = `
                <div class="form-container">
                    <h2 class="form-title">
                        <i class="fas fa-users-class"></i>
                        Asignar Alumnos a: ${subjectName}
                    </h2>
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i>
                        <strong>Módulo en desarrollo</strong>
                        <p>Esta funcionalidad permitirá asignar alumnos individuales o grupos completos.</p>
                        <p>Se podrán manejar casos especiales como alumnos irregulares.</p>
                    </div>
                </div>
            `;
        });
    });
});