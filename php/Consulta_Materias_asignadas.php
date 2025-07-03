<?php
// Establecer el tipo de respuesta como JSON
header('Content-Type: application/json');

// Incluir el archivo de configuración de la base de datos
require_once 'db.php';

// Inicializar un array de resultados
$response = [];

try {
    // Obtener el id_alumno desde la consulta GET
    $id_alumno = isset($_GET['id_alumno']) ? (int)$_GET['id_alumno'] : 0;

    // Verificar si el id_alumno es válido
    if ($id_alumno <= 0) {
        throw new Exception("ID de alumno no válido");
    }

    // Preparar la consulta para obtener las materias asignadas a este alumno
    $stmt = $pdo->prepare("
        SELECT 
            m.id_materia,
            m.nombre AS materia_nombre,
            ma.nombre_completo AS nombre_docente
        FROM asignacion_materias am
        JOIN materias m ON am.id_materia = m.id_materia
        JOIN maestros ma ON m.id_maestro = ma.id_maestro
        WHERE am.numero_control = (SELECT numero_control FROM alumnos WHERE id_alumno = ?)
    ");

    // Ejecutar la consulta pasando el id_alumno como parámetro
    $stmt->execute([$id_alumno]);

    // Obtener los resultados de la consulta
    $materias = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Verificar si hay materias asignadas
    if (count($materias) > 0) {
        $response['materias'] = $materias;
    } else {
        $response['message'] = "No hay materias asignadas para este alumno.";
    }

    // Devolver los resultados en formato JSON
    echo json_encode($response);
} catch (Exception $e) {
    // En caso de error, devolver un mensaje de error
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener las materias: " . $e->getMessage()]);
}
?>
