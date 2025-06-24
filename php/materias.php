<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];

// Conexión a la base de datos (ajusta según tus datos)
$host = 'localhost';
$db   = 'control_escolar';
$user = 'tu_usuario';
$pass = 'tu_contraseña';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit;
}

// Para PUT y DELETE, leer datos crudos
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    parse_str(file_get_contents('php://input'), $input);
}

switch ($method) {
    case 'GET':
        $sql = "SELECT m.*, ma.nombre_completo AS nombre_maestro,
                (SELECT COUNT(*) FROM alumnos_materias am WHERE am.id_materia = m.id_materia) AS alumnos_count
                FROM materias m
                LEFT JOIN maestros ma ON m.id_maestro = ma.id_maestro
                ORDER BY m.id_materia DESC";
        $result = $conn->query($sql);

        $materias = [];
        while ($row = $result->fetch_assoc()) {
            $materias[] = $row;
        }
        echo json_encode($materias);
        break;

    case 'POST':
        $data = $_POST;
        if (empty($data)) $data = $input;

        $matricula = $conn->real_escape_string($data['matricula'] ?? '');
        $nombre = $conn->real_escape_string($data['nombre'] ?? '');
        $unidades = intval($data['unidades'] ?? 5);
        $id_maestro = intval($data['id_maestro'] ?? 0);

        if (!$matricula || !$nombre || !$id_maestro) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan datos obligatorios']);
            exit;
        }

        // Verificar si matrícula existe
        $check = $conn->query("SELECT id_materia FROM materias WHERE matricula = '$matricula'");
        if ($check->num_rows > 0) {
            http_response_code(409);
            echo json_encode(['error' => 'La matrícula ya existe']);
            exit;
        }

        $sql = "INSERT INTO materias (matricula, nombre, unidades, id_maestro) VALUES ('$matricula', '$nombre', $unidades, $id_maestro)";
        if ($conn->query($sql)) {
            echo json_encode(['message' => 'Materia registrada correctamente']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al registrar materia']);
        }
        break;

    case 'PUT':
        $data = $input;

        $id_materia = intval($data['id_materia'] ?? 0);
        $matricula = $conn->real_escape_string($data['matricula'] ?? '');
        $nombre = $conn->real_escape_string($data['nombre'] ?? '');
        $unidades = intval($data['unidades'] ?? 5);
        $id_maestro = intval($data['id_maestro'] ?? 0);

        if (!$id_materia || !$matricula || !$nombre || !$id_maestro) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan datos obligatorios']);
            exit;
        }

        // Verificar si matrícula ya existe en otra materia
        $check = $conn->query("SELECT id_materia FROM materias WHERE matricula = '$matricula' AND id_materia != $id_materia");
        if ($check->num_rows > 0) {
            http_response_code(409);
            echo json_encode(['error' => 'La matrícula ya está en uso por otra materia']);
            exit;
        }

        $sql = "UPDATE materias SET matricula = '$matricula', nombre = '$nombre', unidades = $unidades, id_maestro = $id_maestro WHERE id_materia = $id_materia";
        if ($conn->query($sql)) {
            echo json_encode(['message' => 'Materia actualizada correctamente']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al actualizar materia']);
        }
        break;

    case 'DELETE':
        $id_materia = intval($input['id_materia'] ?? 0);
        if (!$id_materia) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de materia no proporcionado']);
            exit;
        }

        // Eliminar materia
        $sql = "DELETE FROM materias WHERE id_materia = $id_materia";
        if ($conn->query($sql)) {
            echo json_encode(['message' => 'Materia eliminada correctamente']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al eliminar materia']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}

$conn->close();
