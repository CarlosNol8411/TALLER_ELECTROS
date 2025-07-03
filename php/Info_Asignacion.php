<?php
header('Content-Type: application/json');

require_once 'db.php';

$response = [];

try {
    $stmt = $pdo->query("SELECT 
        a.id_alumno,
        a.numero_control,
        a.nombre,
        a.apellido_paterno,
        a.apellido_materno,
        a.carrera_nombre,
        a.semestre_nombre,
        a.email,
        a.telefono,
        a.activo,
        a.fecha_registro
    FROM alumnos a");

    $alumnos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $response['alumnos'] = $alumnos;

    $stmt = $pdo->query("SELECT 
        id_materia,
        nombre
    FROM materias");

    $materias = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response['materias'] = $materias;

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener los datos: " . $e->getMessage()]);
}
?>
