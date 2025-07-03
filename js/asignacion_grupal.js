document.addEventListener("DOMContentLoaded", function() {
    const groupSelect = document.getElementById('groupSelect');
    const materiaSelect = document.getElementById('materiaSelect');
    const confirmBtn = document.getElementById('confirmAssignmentBtn');
    const selectedGroupElement = document.getElementById('selectedGroup'); 
    
    function loadGroups() {
        fetch('php/obtenerGrupos.php')
            .then(response => response.json())
            .then(data => {
                if (data.grupos && data.grupos.length > 0) {
                    data.grupos.forEach(grupo => {
                        const option = document.createElement('option');
                        option.value = grupo.id_grupo;
                        option.textContent = `${grupo.nombre} (${grupo.semestre} - ${grupo.carrera})`;
                        groupSelect.appendChild(option);
                    });
                } else {
                    const option = document.createElement('option');
                    option.textContent = "No hay grupos disponibles";
                    groupSelect.appendChild(option);
                }
            })
            .catch(error => {
                console.error('Error al cargar los grupos:', error);
            });
    }

    function loadMaterias() {
        fetch('php/obtenerMaterias.php')
            .then(response => response.json())
            .then(data => {
                materiaSelect.innerHTML = '<option value="">Seleccione una materia</option>';
                if (data.materias && data.materias.length > 0) {
                    data.materias.forEach(materia => {
                        const option = document.createElement('option');
                        option.value = materia.id_materia;
                        option.textContent = materia.nombre;
                        materiaSelect.appendChild(option);
                    });
                } else {
                    const option = document.createElement('option');
                    option.textContent = "No hay materias disponibles";
                    materiaSelect.appendChild(option);
                }
            })
            .catch(error => {
                console.error('Error al cargar las materias:', error);
            });
    }

    confirmBtn.addEventListener('click', function() {
        const selectedGroup = groupSelect.value;
        const selectedMateria = materiaSelect.value;
        
        if (!selectedGroup || !selectedMateria) {
            Swal.fire({
                icon: 'warning',
                title: 'Faltan datos',
                text: 'Por favor, selecciona un grupo y una materia.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#d33'
            });
            return;
        }

        if (selectedGroupElement) {
            selectedGroupElement.textContent = `Grupo seleccionado: ${groupSelect.options[groupSelect.selectedIndex].text}`;
        }

        fetch('php/Registrar_Asignacion_Grupal.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'id_grupo': selectedGroup,
                'id_materia': selectedMateria
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Asignación realizada',
                    text: 'La materia ha sido asignada al grupo correctamente.',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error || 'Hubo un error al intentar asignar la materia.',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'Hubo un error al enviar los datos al servidor.',
                confirmButtonText: 'Aceptar'
            });
        });
    });

    loadGroups();
    loadMaterias();
});
