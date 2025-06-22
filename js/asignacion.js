document.addEventListener('DOMContentLoaded', function() {
    // Cambiar entre modos de asignación
    document.querySelectorAll('.btn-option').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover active de todos los botones y paneles
            document.querySelectorAll('.btn-option').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.assignment-panel').forEach(p => p.classList.remove('active'));
            
            // Activar el botón clickeado
            this.classList.add('active');
            
            // Mostrar el panel correspondiente
            const mode = this.getAttribute('data-mode');
            document.getElementById(`${mode}Assignment`).classList.add('active');
        });
    });
    
    // Seleccionar grupo para asignación
    document.querySelectorAll('.group-card .assign-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.group-card');
            
            // Actualizar el nombre del grupo seleccionado
            document.getElementById('selectedGroup').textContent = card.querySelector('h4').textContent;
            
            // Aquí podrías cargar dinámicamente las materias disponibles para este grupo
        });
    });
    
    // Seleccionar alumno individual
    document.querySelectorAll('.student-card').forEach(card => {
        card.addEventListener('click', function() {
            // Remover selección anterior
            document.querySelectorAll('.student-card').forEach(c => c.classList.remove('selected'));
            
            // Seleccionar nueva tarjeta
            this.classList.add('selected');
            
            // Actualizar nombre del alumno seleccionado
            document.getElementById('selectedStudent').textContent = this.querySelector('h4').textContent;
            
            // Aquí podrías cargar las materias actuales del alumno
        });
    });
    
    // Seleccionar alumno irregular
    document.querySelectorAll('.irregular-card .assign-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.irregular-card');
            
            // Actualizar el nombre del alumno seleccionado
            document.getElementById('selectedIrregular').textContent = card.querySelector('h4').textContent;
            
            // Aquí podrías cargar dinámicamente las materias faltantes
        });
    });
    
    // Manejo de búsqueda de alumnos
    const studentSearch = document.querySelector('.student-search input');
    if (studentSearch) {
        studentSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll('.student-card');
            
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }
    
    // Confirmar asignación grupal
    document.querySelector('#groupAssignment .confirm-btn')?.addEventListener('click', function() {
        const group = document.getElementById('selectedGroup').textContent;
        const subject = this.closest('.assignment-details').querySelector('select').value;
        
        if (!subject) {
            alert('Por favor seleccione una materia');
            return;
        }
        
        // Obtener excepciones (alumnos no asignados)
        const exceptions = [];
        document.querySelectorAll('.exception-item input:checked').forEach(checkbox => {
            exceptions.push(checkbox.nextElementSibling.textContent.trim());
        });
        
        // Aquí iría la lógica para guardar la asignación
        alert(`Asignando ${subject} al grupo ${group}\nExcepciones: ${exceptions.join(', ') || 'Ninguna'}`);
    });
    
    // Confirmar asignación individual
    document.querySelector('#individualAssignment .confirm-btn')?.addEventListener('click', function() {
        const student = document.getElementById('selectedStudent').textContent;
        const subject = this.closest('.assignment-details').querySelector('select').value;
        
        if (!subject) {
            alert('Por favor seleccione una materia');
            return;
        }
        
        // Aquí iría la lógica para guardar la asignación
        alert(`Asignando ${subject} al alumno ${student}`);
    });
    
    // Confirmar asignación irregular
    document.querySelector('#irregularAssignment .confirm-btn')?.addEventListener('click', function() {
        const student = document.getElementById('selectedIrregular').textContent;
        const selectedSubjects = [];
        
        document.querySelectorAll('.subject-option input:checked').forEach(checkbox => {
            selectedSubjects.push(checkbox.nextElementSibling.textContent.trim());
        });
        
        if (selectedSubjects.length === 0) {
            alert('Por favor seleccione al menos una materia');
            return;
        }
        
        const notes = this.closest('.assignment-details').querySelector('textarea').value;
        
        // Aquí iría la lógica para guardar la asignación
        alert(`Asignando materias a ${student}:\n${selectedSubjects.join('\n')}\nNotas: ${notes || 'Ninguna'}`);
    });
});