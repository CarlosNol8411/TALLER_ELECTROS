document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('studentForm');
    const tabla = document.querySelector('#list tbody');
    const tabRegister = document.querySelector('.tab[data-tab="register"]');
    const tabList = document.querySelector('.tab[data-tab="list"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    let modoEdicion = false;
    let idAlumnoEditando = null;

    // Cambiar pestañas
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab, .tab-content').forEach(el => el.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    cargarAlumnos();

    function cargarAlumnos() {
        fetch('php/alumnos.php')
            .then(res => res.json())
            .then(data => {
                tabla.innerHTML = '';
                data.forEach(alumno => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${alumno.numero_control}</td>
                        <td>${alumno.apellido_paterno} ${alumno.apellido_materno} ${alumno.nombre}</td>
                        <td>${alumno.semestre_nombre}</td>
                        <td>${alumno.carrera_nombre}</td>
                        <td><span class="badge badge-success">Activo</span></td>
                        <td>
                            <div class="actions">
                                <button class="btn-icon edit" data-id="${alumno.id_alumno}" title="Editar"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon delete" data-id="${alumno.id_alumno}" title="Eliminar"><i class="fas fa-trash"></i></button>
                                <button class="btn-icon" title="Asignar Materias"><i class="fas fa-book"></i></button>
                            </div>
                        </td>
                    `;
                    tabla.appendChild(tr);
                });

                agregarEventos();
            })
            .catch(err => console.error('Error al cargar alumnos:', err));
    }

    function agregarEventos() {
        document.querySelectorAll('.btn-icon.edit').forEach(btn => {
            btn.onclick = () => {
                const fila = btn.closest('tr');
                const tds = fila.querySelectorAll('td');

                document.getElementById('controlNumber').value = tds[0].textContent;
                const nombres = tds[1].textContent.trim().split(' ');
                document.getElementById('firstName').value = nombres.slice(2).join(' ');
                document.getElementById('lastName').value = nombres[0];
                document.getElementById('mothersLastName').value = nombres[1] || '';
                document.getElementById('semester').value = tds[2].textContent;
                document.getElementById('career').value = tds[3].textContent;

                modoEdicion = true;
                idAlumnoEditando = btn.dataset.id;
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Alumno';
                tabRegister.click();
            };
        });

        document.querySelectorAll('.btn-icon.delete').forEach(btn => {
            btn.onclick = () => {
                if (confirm('¿Eliminar este alumno?')) {
                    fetch('php/alumnos.php', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id_alumno: btn.dataset.id })
                    })
                    .then(res => res.json())
                    .then(() => cargarAlumnos())
                    .catch(err => alert('Error al eliminar alumno'));
                }
            };
        });
    }

    form.onsubmit = e => {
        e.preventDefault();

        const datos = {
            numero_control: document.getElementById('controlNumber').value,
            nombre: document.getElementById('firstName').value,
            apellido_paterno: document.getElementById('lastName').value,
            apellido_materno: document.getElementById('mothersLastName').value,
            carrera_nombre: document.getElementById('career').value,
            semestre_nombre: document.getElementById('semester').value,
            email: '',
            telefono: ''
        };

        if (modoEdicion) {
            datos.id_alumno = idAlumnoEditando;
            fetch('php/alumnos.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            })
            .then(res => res.json())
            .then(() => {
                form.reset();
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Registrar Alumno';
                modoEdicion = false;
                cargarAlumnos();
                tabList.click();
            })
            .catch(err => alert('Error al actualizar alumno'));
        } else {
            fetch('php/alumnos.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            })
            .then(res => res.json())
            .then(() => {
                form.reset();
                cargarAlumnos();
                tabList.click();
            })
            .catch(err => alert('Error al registrar alumno'));
        }
    };
});
