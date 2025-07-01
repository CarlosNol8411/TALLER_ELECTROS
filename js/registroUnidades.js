document.addEventListener("DOMContentLoaded", () => {
    const docenteSelect = document.getElementById("docenteSelect");
    const materiaSelect = document.getElementById("materiaSelect");
    const form = document.getElementById("unitForm");
    const tableBody = document.querySelector("#unitTable tbody");

    const API_URL = "php/registro_unidades.php";

    // Cargar docentes
    fetch(`${API_URL}?action=get_docentes`)
        .then(res => res.json())
        .then(data => {
            docenteSelect.innerHTML = '<option value="" hidden>Seleccione un docente</option>';
            data.forEach(docente => {
                const option = document.createElement("option");
                option.value = docente.id_maestro;
                option.textContent = docente.nombre_completo;
                docenteSelect.appendChild(option);
            });
        })
        .catch(err => {
            alert("Error al cargar docentes");
            console.error(err);
        });

    // Cargar materias según el docente seleccionado
    docenteSelect.addEventListener("change", () => {
        const idMaestro = docenteSelect.value;
        materiaSelect.innerHTML = '<option value="" hidden>Seleccione una materia</option>';
        if (!idMaestro) return;

        fetch(`${API_URL}?action=get_materias&id_maestro=${idMaestro}`)
            .then(res => res.json())
            .then(data => {
                data.forEach(materia => {
                    const option = document.createElement("option");
                    option.value = materia.id_materia;
                    option.textContent = materia.nombre;
                    materiaSelect.appendChild(option);
                });
            })
            .catch(err => {
                alert("Error al cargar materias");
                console.error(err);
            });
    });

    // Buscar alumnos y llenar tabla
    form.addEventListener("submit", e => {
        e.preventDefault();
        const idMateria = materiaSelect.value;
        if (!idMateria) {
            alert("Seleccione una materia válida");
            return;
        }

        fetch(`${API_URL}?action=get_alumnos&id_materia=${idMateria}`)
            .then(res => res.json())
            .then(data => {
                tableBody.innerHTML = "";

                if (!data.length) {
                    tableBody.innerHTML = `<tr><td colspan="8">No hay alumnos inscritos en esta materia</td></tr>`;
                    return;
                }

                data.forEach(row => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${row.materia}</td>
                        <td>${row.nombre_completo}</td>
                        <td contenteditable="true">${row.unidad_1 ?? ""}</td>
                        <td contenteditable="true">${row.unidad_2 ?? ""}</td>
                        <td contenteditable="true">${row.unidad_3 ?? ""}</td>
                        <td contenteditable="true">${row.unidad_4 ?? ""}</td>
                        <td contenteditable="true">${row.unidad_5 ?? ""}</td>
                        <td contenteditable="true">${row.unidad_6 ?? ""}</td>
                    `;
                    tableBody.appendChild(tr);
                });

                document.getElementById("list").classList.add("active");
            })
            .catch(err => {
                alert("Error al cargar alumnos");
                console.error(err);
            });
    });
});
