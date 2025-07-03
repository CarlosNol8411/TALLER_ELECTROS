<?php
require_once 'db.php';

$response = [];

try {
    $stmt = $pdo->query("SELECT g.id_grupo, g.nombre, s.nombre AS semestre, c.nombre AS carrera FROM grupos g
                         JOIN semestres s ON g.id_semestre = s.id_semestre
                         JOIN carreras c ON g.id_carrera = c.id_carrera");

    $grupos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $response['grupos'] = $grupos;

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al obtener los grupos: ' . $e->getMessage()]);
}
?>
