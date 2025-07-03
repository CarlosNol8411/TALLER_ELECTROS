<?php
require_once 'db.php';

$response = [];

try {
    $stmt = $pdo->query("SELECT id_materia, nombre FROM materias WHERE activa = 1");

    $materias = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $response['materias'] = $materias;

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al obtener las materias: ' . $e->getMessage()]);
}
?>
