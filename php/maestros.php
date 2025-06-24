<?php
// php/maestros.php
header('Content-Type: application/json');
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Para PUT y DELETE recibiremos datos JSON
parse_str(file_get_contents("php://input"), $input);

if ($method === 'GET') {
    // Obtener todos los docentes
    try {
        $stmt = $pdo->query("SELECT 
    m.*,
    GROUP_CONCAT(mat.nombre SEPARATOR ', ') AS materias_asignadas
FROM 
    maestros m
LEFT JOIN 
    materias mat ON mat.id_maestro = m.id_maestro
GROUP BY 
    m.id_maestro
ORDER BY 
    m.fecha_registro DESC
");
        $maestros = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($maestros);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al obtener docentes: " . $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Insertar nuevo docente
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['numero_control'], $data['nombre_completo'])) {
        http_response_code(400);
        echo json_encode(["error" => "Datos incompletos"]);
        exit;
    }
    try {
        $stmt = $pdo->prepare("INSERT INTO maestros (numero_control, nombre_completo) VALUES (:numero_control, :nombre_completo)");
        $stmt->execute([
            ':numero_control' => $data['numero_control'],
            ':nombre_completo' => $data['nombre_completo']
        ]);
        echo json_encode(["message" => "Docente registrado", "id" => $pdo->lastInsertId()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al registrar docente: " . $e->getMessage()]);
    }
} elseif ($method === 'PUT') {
    // Actualizar docente
    if (!isset($input['id_maestro'], $input['numero_control'], $input['nombre_completo'])) {
        http_response_code(400);
        echo json_encode(["error" => "Datos incompletos para actualizar"]);
        exit;
    }
    try {
        $stmt = $pdo->prepare("UPDATE maestros SET numero_control = :numero_control, nombre_completo = :nombre_completo WHERE id_maestro = :id_maestro");
        $stmt->execute([
            ':numero_control' => $input['numero_control'],
            ':nombre_completo' => $input['nombre_completo'],
            ':id_maestro' => $input['id_maestro']
        ]);
        echo json_encode(["message" => "Docente actualizado"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al actualizar docente: " . $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    // Eliminar docente
    if (!isset($input['id_maestro'])) {
        http_response_code(400);
        echo json_encode(["error" => "Falta id para eliminar"]);
        exit;
    }
    try {
        $stmt = $pdo->prepare("DELETE FROM maestros WHERE id_maestro = :id_maestro");
        $stmt->execute([':id_maestro' => $input['id_maestro']]);
        echo json_encode(["message" => "Docente eliminado"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al eliminar docente: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
}
