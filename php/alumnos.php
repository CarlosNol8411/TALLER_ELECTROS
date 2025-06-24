<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';  // incluye la conexión PDO $pdo

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $stmt = $pdo->query("SELECT * FROM alumnos ORDER BY id_alumno DESC");
            $alumnos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($alumnos);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al obtener alumnos: " . $e->getMessage()]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if (
            !$data || 
            !isset($data['numero_control'], $data['nombre'], $data['apellido_paterno'], $data['apellido_materno'], $data['carrera_nombre'], $data['semestre_nombre'])
        ) {
            http_response_code(400);
            echo json_encode(["error" => "Datos incompletos o mal formateados"]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO alumnos 
                (numero_control, nombre, apellido_paterno, apellido_materno, carrera_nombre, semestre_nombre, email, telefono) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['numero_control'],
                $data['nombre'],
                $data['apellido_paterno'],
                $data['apellido_materno'],
                $data['carrera_nombre'],
                $data['semestre_nombre'],
                $data['email'] ?? '',
                $data['telefono'] ?? ''
            ]);
            echo json_encode(["success" => true, "message" => "Alumno registrado"]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(["error" => "Error al registrar: " . $e->getMessage()]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['id_alumno'])) {
            http_response_code(400);
            echo json_encode(["error" => "ID de alumno requerido para actualizar"]);
            exit;
        }
        try {
            $stmt = $pdo->prepare("UPDATE alumnos SET 
                numero_control = ?, nombre = ?, apellido_paterno = ?, apellido_materno = ?, 
                carrera_nombre = ?, semestre_nombre = ?, email = ?, telefono = ? 
                WHERE id_alumno = ?");
            $stmt->execute([
                $data['numero_control'],
                $data['nombre'],
                $data['apellido_paterno'],
                $data['apellido_materno'],
                $data['carrera_nombre'],
                $data['semestre_nombre'],
                $data['email'] ?? '',
                $data['telefono'] ?? '',
                $data['id_alumno']
            ]);
            echo json_encode(["success" => true, "message" => "Alumno actualizado"]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(["error" => "Error al actualizar: " . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['id_alumno'])) {
            http_response_code(400);
            echo json_encode(["error" => "ID de alumno requerido para eliminar"]);
            exit;
        }
        try {
            $stmt = $pdo->prepare("DELETE FROM alumnos WHERE id_alumno = ?");
            $stmt->execute([$data['id_alumno']]);
            echo json_encode(["success" => true, "message" => "Alumno eliminado"]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(["error" => "Error al eliminar: " . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}
