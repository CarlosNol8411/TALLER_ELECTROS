document.addEventListener('DOMContentLoaded', function() {
    // Actualizar fecha del reporte
    const today = new Date();
    document.getElementById('reportDate').textContent += today.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    
    // Cambiar entre unidades
    document.querySelectorAll('.unit-tabs .tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover active de todas las pestañas y contenidos
            document.querySelectorAll('.unit-tabs .tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.unit-content').forEach(c => c.classList.remove('active'));
            
            // Agregar clase active a la pestaña clickeada
            this.classList.add('active');
            
            // Mostrar el contenido correspondiente
            const unit = this.getAttribute('data-unit');
            document.querySelector(`.unit-content[data-unit="${unit}"]`).classList.add('active');
        });
    });
    
    // Generar reporte al seleccionar materia
    document.getElementById('generateReport').addEventListener('click', function() {
        const subject = document.getElementById('subjectFilter').value;
        const semester = document.getElementById('semesterFilter').value;
        
        if (!subject) {
            alert('Por favor seleccione una materia');
            return;
        }
        
        // Actualizar título del reporte
        const subjectName = document.getElementById('subjectFilter').options[document.getElementById('subjectFilter').selectedIndex].text;
        document.getElementById('reportSubject').textContent = `Materia: ${subjectName}`;
        document.getElementById('reportSemester').textContent = `Semestre: ${semester || 'Todos'}`;
        
        // Aquí iría la lógica para cargar los datos reales desde el backend
        // Por ahora usamos datos de ejemplo
        
        // Mostrar la primera unidad por defecto
        document.querySelector('.unit-tabs .tab').click();
        
        // Generar gráficas
        generateCharts();
    });
    
    // Función para generar gráficas
    function generateCharts() {
        // Datos de ejemplo para las gráficas
        const unitData = {
            labels: ['Unidad I', 'Unidad II', 'Unidad III', 'Unidad IV', 'Unidad V', 'Unidad VI'],
            averages: [92.4, 89.2, 93.7, 95.1, 88.3, 91.5],
            failureRates: [6.25, 12.5, 6.25, 6.25, 12.5, 6.25]
        };
        
        const gradesDistribution = {
            labels: ['0-69', '70-79', '80-89', '90-100'],
            counts: [1, 2, 5, 8]
        };
        
        // Gráfica de tendencia de unidades
        const trendCtx = document.getElementById('unitTrendChart').getContext('2d');
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: unitData.labels,
                datasets: [{
                    label: 'Promedio',
                    data: unitData.averages,
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.3,
                    fill: true
                }, {
                    label: '% Reprobación',
                    data: unitData.failureRates,
                    borderColor: '#f72585',
                    backgroundColor: 'rgba(247, 37, 133, 0.1)',
                    tension: 0.3,
                    fill: true,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.datasetIndex === 0) {
                                    label += context.raw.toFixed(1) + ' pts';
                                } else {
                                    label += context.raw.toFixed(1) + '%';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 80,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Promedio'
                        }
                    },
                    y1: {
                        position: 'right',
                        beginAtZero: true,
                        max: 20,
                        title: {
                            display: true,
                            text: '% Reprobación'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
        
        // Gráfica de distribución de calificaciones
        const distCtx = document.getElementById('gradesDistributionChart').getContext('2d');
        new Chart(distCtx, {
            type: 'bar',
            data: {
                labels: gradesDistribution.labels,
                datasets: [{
                    label: 'Número de Alumnos',
                    data: gradesDistribution.counts,
                    backgroundColor: [
                        'rgba(247, 37, 133, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(255, 205, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)'
                    ],
                    borderColor: [
                        'rgba(247, 37, 133, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Número de Alumnos'
                        }
                    }
                }
            }
        });
    }
    
    // Exportar a Excel
    document.getElementById('exportReport').addEventListener('click', function() {
        alert('Funcionalidad para exportar a Excel. Esto generaría un archivo similar al ejemplo proporcionado.');
        // Aquí iría la lógica para generar y descargar el archivo Excel
    });
    
    // Generar reporte de ejemplo al cargar la página si hay una materia seleccionada
    if (document.getElementById('subjectFilter').value) {
        document.getElementById('generateReport').click();
    }
});