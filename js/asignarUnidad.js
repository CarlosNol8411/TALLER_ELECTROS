document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('dynamicTable');
    
    // Hacer editable las celdas con clase 'editable'
    table.addEventListener('click', function(e) {
        const cell = e.target;
        
        if (cell.classList.contains('editable')) {
            makeCellEditable(cell);
        }
    });
    
    function makeCellEditable(cell) {
        // Si ya está en modo edición, no hacer nada
        if (cell.classList.contains('editing')) return;
        
        const originalContent = cell.textContent;
        
        // Crear input
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalContent;
        input.style.width = (cell.offsetWidth - 10) + 'px';
        
        // Aplicar estilos
        cell.classList.add('editing');
        cell.innerHTML = '';
        cell.appendChild(input);
        input.focus();
        
        // Guardar al perder foco o presionar Enter
        input.addEventListener('blur', saveContent);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveContent.call(this);
            }
        });
        
        function saveContent() {
            cell.textContent = this.value || '';
            cell.classList.remove('editing');
        }
    }
    
    // También puedes permitir guardar todos los datos de la tabla
    // Agregar un botón de guardar si lo necesitas
});