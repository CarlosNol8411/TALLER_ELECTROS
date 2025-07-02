document.addEventListener("DOMContentLoaded", () => {
  const docenteSelect = document.getElementById("docenteSelect");
  const materiaSelect = document.getElementById("materiaSelect");
  const form = document.getElementById("unitForm");
  const table = document.getElementById("unitTable");
  const thead = table.querySelector("thead tr");
  const tbody = table.querySelector("tbody");
  const guardarBtn = document.getElementById("guardarCambios");

  const API_URL = "php/registro_unidades.php";
  let unidadesMateria = 6; // por defecto

  fetch(`${API_URL}?action=get_docentes`)
    .then(res => res.json())
    .then(data => {
      docenteSelect.innerHTML = '<option value="" hidden>Seleccione un docente</option>';
      data.forEach(d => {
        const option = document.createElement("option");
        option.value = d.id_maestro;
        option.textContent = d.nombre_completo;
        docenteSelect.appendChild(option);
      });
    });

  docenteSelect.addEventListener("change", () => {
    const idMaestro = docenteSelect.value;
    materiaSelect.innerHTML = '<option value="" hidden>Seleccione una materia</option>';
    if (!idMaestro) return;

    fetch(`${API_URL}?action=get_materias&id_maestro=${idMaestro}`)
      .then(res => res.json())
      .then(data => {
        data.forEach(m => {
          const option = document.createElement("option");
          option.value = m.id_materia;
          option.textContent = m.nombre;
          option.setAttribute("data-unidades", m.num_unidades);
          materiaSelect.appendChild(option);
        });
      });
  });

  materiaSelect.addEventListener("change", () => {
    const selected = materiaSelect.options[materiaSelect.selectedIndex];
    unidadesMateria = parseInt(selected.getAttribute("data-unidades")) || 6;
  });

form.addEventListener("submit", e => {
  e.preventDefault();
  const idMateria = materiaSelect.value;
  if (!idMateria) return;

  fetch(`${API_URL}?action=get_alumnos&id_materia=${idMateria}`)
    .then(res => res.json())
    .then(result => {
      const numUnidades = result.unidades;
      const data = result.alumnos;

      tbody.innerHTML = "";
      thead.innerHTML = `
        <th>Materia</th>
        <th>Alumno</th>
        ${Array.from({ length: numUnidades }, (_, i) => `<th>Unidad ${i + 1}</th>`).join("")}
      `;

      data.forEach(row => {
        const tr = document.createElement("tr");
        tr.setAttribute("data-alumno", row.nombre_completo);
        tr.innerHTML = `
          <td>${row.materia}</td>
          <td>${row.nombre_completo}</td>
          ${Array.from({ length: numUnidades }, (_, i) => `
            <td contenteditable="true">${row[`unidad_${i + 1}`] ?? ""}</td>
          `).join("")}
        `;
        tbody.appendChild(tr);
      });

      document.getElementById("list").classList.add("active");
    })
    .catch(err => {
      console.error("Error al obtener alumnos:", err);
      alert("Error al cargar los datos.");
    });
});


  guardarBtn.addEventListener("click", () => {
    const filas = tbody.querySelectorAll("tr");
    const datos = Array.from(filas).map(fila => {
      const celdas = fila.querySelectorAll("td");
      return {
        alumno: fila.getAttribute("data-alumno"),
        calificaciones: Array.from(celdas).slice(2).map(td => td.textContent.trim())
      };
    });

    fetch(`${API_URL}?action=guardar_calificaciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_materia: materiaSelect.value,
        data: datos
      })
    })
    .then(res => res.json())
    .then(response => {
      alert("✅ Calificaciones guardadas correctamente.");
    })
    .catch(err => {
      console.error("Error:", err);
      alert("❌ Error al guardar calificaciones.");
    });
  });
});
