document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'php/materias.php';
    const apiMaestrosUrl = 'php/maestros.php'; // Para cargar maestros en el select

    // Elementos del formulario
    const subjectForm = document.getElementById('subjectForm');
    const submitBtn = subjectForm.querySelector('button[type="submit"]');
    const subjectCodeInput = document.getElementById('subjectCode');
    const subjectNameInput = document.getElementById('subjectName');
    const unitsInput = document.getElementById('units');
    const teacherSelect = document.getElementById('teacher');
    const tbody = document.querySelector('#list tbody');
    const searchInput = document.getElementById('searchSubject');

    // Función para cargar maestros en el select, devuelve Promise
    function cargarMaestros() {
        return fetch(apiMaestrosUrl)
            .then(res => res.json())
            .then(data => {
                teacherSelect.innerHTML = '<option value="">Seleccione un docente...</option>';
                data.forEach(maestro => {
                    const option = document.createElement('option');
                    option.value = maestro.id_maestro; // Aquí el id para guardar
                    option.textContent = maestro.nombre_completo;
                    teacherSelect.appendChild(option);
                });
            })
            .catch(err => console.error('Error al cargar maestros:', err));
    }

    // Función para cargar materias y llenar la tabla
    function cargarMaterias() {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                tbody.innerHTML = '';
                data.forEach(materia => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${materia.matricula}</td>
                        <td>${materia.nombre}</td>
                        <td>${materia.unidades}</td>
                        <td>${materia.nombre_maestro || '-'}</td>
                        <td>${materia.alumnos_count || 0}</td>
                        <td>
                            <div class="actions">
                                <button class="btn-icon edit" title="Editar" data-id="${materia.id_materia}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon delete" title="Eliminar" data-id="${materia.id_materia}">
                                    <i class="fas fa-trash"></i>
                                </button>
                                <button class="btn-icon assign" title="Asignar Alumnos" data-id="${materia.id_materia}">
                                    <i class="fas fa-user-graduate"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
                agregarEventosBotones();
            })
            .catch(err => console.error('Error al cargar materias:', err));
    }

    // Limpiar formulario y reset botón
    function resetForm() {
        subjectForm.reset();
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Registrar Materia';
        delete subjectForm.dataset.editingId;
    }

    // Evento para registrar o actualizar materia
    subjectForm.addEventListener('submit', e => {
        e.preventDefault();

        // Validar datos
        const data = {
            matricula: subjectCodeInput.value.trim(),
            nombre: subjectNameInput.value.trim(),
            unidades: parseInt(unitsInput.value),
            id_maestro: teacherSelect.value
        };

        if (!data.matricula || !data.nombre || !data.unidades || !data.id_maestro) {
            alert('Por favor complete todos los campos');
            return;
        }

        if (subjectForm.dataset.editingId) {
            // Actualizar materia
            data.id_materia = subjectForm.dataset.editingId;
            fetch(apiUrl, {
                method: 'PUT',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams(data)
            })
            .then(res => res.json())
            .then(res => {
                alert(res.message || 'Materia actualizada');
                resetForm();
                cargarMaterias();
                document.querySelector('.tab[data-tab="list"]').click();
            })
            .catch(() => alert('Error al actualizar materia'));
        } else {
            // Registrar materia nueva
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
                    alert(res.message || 'Materia registrada');
                    resetForm();
                    cargarMaterias();
                    document.querySelector('.tab[data-tab="list"]').click();
                }
            })
            .catch(() => alert('Error al registrar materia'));
        }
    });

    // Función para agregar eventos a los botones editar, eliminar y asignar
    function agregarEventosBotones() {
        // Editar
        document.querySelectorAll('.btn-icon.edit').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                fetch(apiUrl)
                    .then(res => res.json())
                    .then(data => {
                        const materia = data.find(m => m.id_materia == id);
                        if (!materia) return alert('Materia no encontrada');

                        // Esperar que maestros estén cargados antes de asignar valores
                        cargarMaestros().then(() => {
                            subjectCodeInput.value = materia.matricula;
                            subjectNameInput.value = materia.nombre;
                            unitsInput.value = materia.unidades;
                            teacherSelect.value = materia.id_maestro;

                            submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Materia';
                            subjectForm.dataset.editingId = id;

                            document.querySelector('.tab[data-tab="register"]').click();
                        });
                    });
            };
        });

        // Eliminar
        document.querySelectorAll('.btn-icon.delete').forEach(btn => {
            btn.onclick = () => {
                if (!confirm('¿Seguro que quieres eliminar esta materia?')) return;
                const id = btn.getAttribute('data-id');
                fetch(apiUrl, {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: new URLSearchParams({id_materia: id})
                })
                .then(res => res.json())
                .then(res => {
                    alert(res.message || 'Materia eliminada');
                    cargarMaterias();
                })
                .catch(() => alert('Error al eliminar materia'));
            };
        });

        // Asignar (placeholder)
        document.querySelectorAll('.btn-icon.assign').forEach(btn => {
            btn.onclick = () => {
                alert('Funcionalidad para asignar alumnos próximamente');
            };
        });
    }

    // Búsqueda en la tabla
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        tbody.querySelectorAll('tr').forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Pestañas
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            if (tabId === 'list') {
                cargarMaterias();
            }
            if (tabId === 'register') {
                resetForm();
                cargarMaestros();
            }
        });
    });

    // Inicializar datos
    cargarMaestros();
    cargarMaterias();
});
