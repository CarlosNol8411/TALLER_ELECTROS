document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'php/maestros.php';

    // Función para cargar docentes y mostrar en la tabla
function cargarDocentes() {
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#list tbody');
            tbody.innerHTML = '';
            data.forEach(docente => {
                const estado = docente.activo == 1 ? 
                    '<span class="badge badge-success">Activo</span>' : 
                    '<span class="badge">Inactivo</span>';

                const materias = docente.materias_asignadas && docente.materias_asignadas.trim() !== '' 
                    ? docente.materias_asignadas 
                    : '-';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${docente.numero_control}</td>
                    <td>${docente.nombre_completo}</td>
                    <td>${materias}</td>
                    <td>${estado}</td>
                    <td>
                        <div class="actions">
                            <button class="btn-icon edit" title="Editar" data-id="${docente.id_maestro}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon delete" title="Eliminar" data-id="${docente.id_maestro}">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="btn-icon assign" title="Asignar Materias" data-id="${docente.id_maestro}">
                                <i class="fas fa-book"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            agregarEventosBotones();
        })
        .catch(err => console.error('Error al cargar docentes:', err));
}


    // Variables del formulario
    const teacherForm = document.getElementById('teacherForm');
    const submitBtn = teacherForm.querySelector('button[type="submit"]');
    const controlNumberInput = document.getElementById('controlNumber');
    const fullNameInput = document.getElementById('fullName');

    // Validación simple para número de control (debe empezar con 'D')
    controlNumberInput.addEventListener('blur', function() {
        if (this.value && !this.value.startsWith('D')) {
            this.setCustomValidity('El número de control para docentes debe comenzar con "D"');
            this.reportValidity();
        } else {
            this.setCustomValidity('');
        }
    });

    // Función para limpiar formulario y reset botón
    function resetForm() {
        teacherForm.reset();
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Registrar Docente';
        delete teacherForm.dataset.editingId;
    }

    // Evento para enviar formulario (registro o actualización)
    teacherForm.addEventListener('submit', e => {
        e.preventDefault();

        if (!controlNumberInput.value.startsWith('D')) {
            alert('El número de control para docentes debe comenzar con "D"');
            return;
        }

        const data = {
            numero_control: controlNumberInput.value.trim(),
            nombre_completo: fullNameInput.value.trim()
        };

        if (teacherForm.dataset.editingId) {
            // Actualizar docente
            data.id_maestro = teacherForm.dataset.editingId;
            fetch(apiUrl, {
                method: 'PUT',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams(data)
            })
            .then(res => res.json())
            .then(res => {
                alert(res.message || 'Docente actualizado');
                resetForm();
                cargarDocentes();
                document.querySelector('.tab[data-tab="list"]').click();
            })
            .catch(() => alert('Error al actualizar docente'));
        } else {
            // Registrar nuevo docente
            fetch(apiUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    alert('Error: ' + res.error);
                } else {
                    alert(res.message || 'Docente registrado');
                    resetForm();
                    cargarDocentes();
                    document.querySelector('.tab[data-tab="list"]').click();
                }
            })
            .catch(() => alert('Error al registrar docente'));
        }
    });

    // Función para agregar eventos a los botones de editar, eliminar y asignar
    function agregarEventosBotones() {
        // Editar
        document.querySelectorAll('.btn-icon.edit').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                fetch(apiUrl)
                    .then(res => res.json())
                    .then(data => {
                        const docente = data.find(d => d.id_maestro == id);
                        if (!docente) return alert('Docente no encontrado');

                        controlNumberInput.value = docente.numero_control;
                        fullNameInput.value = docente.nombre_completo;
                        submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Docente';
                        teacherForm.dataset.editingId = id;

                        // Cambiar a pestaña de registro
                        document.querySelector('.tab[data-tab="register"]').click();
                    });
            };
        });

        // Eliminar
        document.querySelectorAll('.btn-icon.delete').forEach(btn => {
            btn.onclick = () => {
                if (!confirm('¿Seguro que quieres eliminar este docente?')) return;
                const id = btn.getAttribute('data-id');
                fetch(apiUrl, {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: new URLSearchParams({id_maestro: id})
                })
                .then(res => res.json())
                .then(res => {
                    alert(res.message || 'Docente eliminado');
                    cargarDocentes();
                })
                .catch(() => alert('Error al eliminar docente'));
            };
        });

        // Asignar materias (por ahora solo alerta)
        document.querySelectorAll('.btn-icon.assign').forEach(btn => {
            btn.onclick = () => {
                alert('Funcionalidad para asignar materias próximamente');
            };
        });
    }

    // Inicializamos la carga de docentes al cargar la página
    cargarDocentes();

    // Funcionalidad de pestañas
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            if (tabId === 'list') {
                cargarDocentes();
            }
        });
    });
});
