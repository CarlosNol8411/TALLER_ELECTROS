<?php
// Conectar a la base de datos
require_once 'db.php';

// Obtener los datos enviados por POST
$numero_control = $_POST['numero_control'];
$id_materia = $_POST['id_materia'];
$tipo_alumno = $_POST['tipo_alumno'];

// Verificar que el alumno existe
$query = "SELECT * FROM alumnos WHERE numero_control = :numero_control";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':numero_control', $numero_control);
$stmt->execute();
$alumno = $stmt->fetch(PDO::FETCH_ASSOC);

// Si el alumno no existe, responder con un error
if (!$alumno) {
    echo json_encode(['success' => false, 'error' => 'Alumno no encontrado']);
    exit;
}

// Verificar que la materia exista
$query = "SELECT * FROM materias WHERE id_materia = :id_materia";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':id_materia', $id_materia);
$stmt->execute();
$materia = $stmt->fetch(PDO::FETCH_ASSOC);

// Si la materia no existe, responder con un error
if (!$materia) {
    echo json_encode(['success' => false, 'error' => 'Materia no encontrada']);
    exit;
}

// Insertar la asignación en la base de datos
$query = "
    INSERT INTO asignacion_materias (numero_control, id_materia, estado)
    VALUES (:numero_control, :id_materia, :estado)
";

$stmt = $pdo->prepare($query);
$stmt->bindParam(':numero_control', $numero_control);
$stmt->bindParam(':id_materia', $id_materia);
$stmt->bindParam(':estado', $tipo_alumno);

try {
    $stmt->execute();
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    // Verificar si el error es una violación de clave única (materia ya asignada)
    if ($e->getCode() === '23000') {
        // Código de error para violación de clave única
        echo json_encode(['success' => false, 'error' => 'La materia ya fue asignada a este alumno.']);
    } else {
        // Para cualquier otro tipo de error
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
?>
