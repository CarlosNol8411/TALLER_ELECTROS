document.addEventListener("DOMContentLoaded", function() {
    const searchBox = document.querySelector('.search-box input');
    const studentList = document.querySelector('.student-list');
    const materiaSelect = document.querySelector('#materiaSelect');
    const currentAssignmentsList = document.querySelector('.assignment-list');
    const confirmBtn = document.querySelector('#confirmAssignmentBtn');
    const selectedStudentElement = document.querySelector('#selectedStudent');

    function loadData() {
        fetch('php/Info_Asignacion.php')
            .then(response => response.json())
            .then(data => {
                if (data.materias && data.materias.length > 0) {
                    data.materias.forEach(materia => {
                        const option = document.createElement('option');
                        option.value = materia.id_materia;
                        option.textContent = materia.nombre;
                        materiaSelect.appendChild(option);
                    });
                }
                window.alumnos = data.alumnos;
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
            });
    }

    function getAssignedSubjects(idAlumno) {
        fetch(`php/Consulta_Materias_asignadas.php?id_alumno=${idAlumno}`)
            .then(response => response.json())
            .then(data => {
                currentAssignmentsList.innerHTML = '';
                if (data.materias && data.materias.length > 0) {
                    data.materias.forEach(materia => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            <span>${materia.materia_nombre}</span>
                        `;
                        currentAssignmentsList.appendChild(listItem);
                    });
                } else {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = '<span>No tiene materias asignadas.</span>';
                    currentAssignmentsList.appendChild(listItem);
                }
            })
            .catch(error => {
                console.error('Error al obtener las materias asignadas:', error);
            });
    }

    function searchStudentByControlNumber(query) {
        const regex = /^[Zz]\d{8}$/;
        
        if (!regex.test(query)) {
            Swal.fire({
                icon: 'error',
                title: 'Formato de número de control incorrecto',
                text: 'El número de control debe tener el formato: Z21020099',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#3085d6'
            });
            return false;
        }

        const filteredData = window.alumnos.filter(student => student.numero_control === query);

        studentList.innerHTML = '';

        if (filteredData.length > 0) {
            const student = filteredData[0];
            const studentCard = document.createElement('div');
            studentCard.classList.add('student-card');
            studentCard.innerHTML = `
                <h4>${student.nombre} ${student.apellido_paterno} ${student.apellido_materno}</h4>
                <p>${student.numero_control} | ${student.semestre_nombre} ${student.carrera_nombre}</p>
            `;
            studentList.appendChild(studentCard);

            selectedStudentElement.textContent = `${student.nombre} ${student.apellido_paterno} ${student.apellido_materno}`;

            getAssignedSubjects(student.id_alumno);

            window.selectedStudent = student;
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Alumno no encontrado',
                text: 'El número de control proporcionado no corresponde a ningún alumno registrado.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#d33'
            });
        }
    }

    searchBox.addEventListener('input', function() {
        const query = searchBox.value.trim();
        
        if (query.length === 9) {
            searchStudentByControlNumber(query);
        } else {
            studentList.innerHTML = '';
            currentAssignmentsList.innerHTML = '';
        }
    });

    confirmBtn.addEventListener('click', function() {
        const numeroControl = window.selectedStudent ? window.selectedStudent.numero_control : '';
        
        const regex = /^[Zz]\d{8}$/;
        if (!regex.test(numeroControl)) {
            Swal.fire({
                icon: 'error',
                title: 'Número de Control Incorrecto',
                text: 'El número de control debe estar en el formato: Z21020099.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#d33'
            });
            return;
        }

        const selectedMateriaId = materiaSelect.value;
        const selectedMateriaText = materiaSelect.options[materiaSelect.selectedIndex].text;
        
        const tipoAlumnoSelect = document.querySelector('.assignment-details select');
        const tipoAlumno = tipoAlumnoSelect ? tipoAlumnoSelect.value : "No seleccionado";

        if (window.selectedStudent && selectedMateriaId && tipoAlumno !== "No seleccionado") {
            
            Swal.fire({
                title: 'Confirmar Asignación',
                text: `Número de Control: ${numeroControl}\nMateria: ${selectedMateriaText}\nTipo de Alumno: ${tipoAlumno}`,
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#3085d6'
            });

            fetch('php/Registrar_Asignacion_Materia.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'numero_control': numeroControl,
                    'id_materia': selectedMateriaId,
                    'tipo_alumno': tipoAlumno
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Materia asignada correctamente',
                        text: 'La materia ha sido asignada al alumno con éxito.',
                        confirmButtonText: 'Aceptar'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al asignar la materia',
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
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Faltan datos',
                text: 'Por favor, asegúrate de seleccionar un alumno, una materia y un tipo de alumno.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#d33'
            });
        }
    });

    loadData();
});
