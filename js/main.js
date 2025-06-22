// Funcionalidad común a todas las páginas
document.addEventListener('DOMContentLoaded', function() {
    // Puedes agregar aquí funcionalidad que se comparta en todas las páginas
    console.log('Sistema de Control Escolar cargado');
    
    // Ejemplo: Actualizar el año en el footer
    const yearElement = document.querySelector('footer p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = yearElement.textContent.replace('2023', currentYear);
    }
});