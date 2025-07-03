<?php
require_once 'db.php';

$response = [];

try {
    $id_grupo = $_POST['id_grupo'];
    $id_materia = $_POST['id_materia'];

    $stmt = $pdo->prepare("SELECT * FROM asignacion_grupal_materias WHERE id_grupo = :id_grupo AND id_materia = :id_materia");
    $stmt->bindParam(':id_grupo', $id_grupo);
    $stmt->bindParam(':id_materia', $id_materia);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'error' => 'La materia ya ha sido asignada a este grupo.']);
        exit;
    }

    $query = "INSERT INTO asignacion_grupal_materias (id_grupo, id_materia) VALUES (:id_grupo, :id_materia)";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id_grupo', $id_grupo);
    $stmt->bindParam(':id_materia', $id_materia);
    $stmt->execute();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
