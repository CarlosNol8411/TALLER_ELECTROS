<?php
require 'db.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get_docentes':
        try {
            $stmt = $pdo->query("SELECT id_maestro, nombre_completo FROM maestros WHERE activo = 1");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al obtener docentes"]);
        }
        break;

    case 'get_materias':
        $id_maestro = intval($_GET['id_maestro'] ?? 0);
        try {
            $stmt = $pdo->prepare("SELECT id_materia, nombre FROM materias WHERE id_maestro = ? AND activa = 1");
            $stmt->execute([$id_maestro]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al obtener materias"]);
        }
        break;

    case 'get_alumnos':
        $id_materia = intval($_GET['id_materia'] ?? 0);
        try {
            $sql = "
                SELECT 
                    m.nombre AS materia,
                    CONCAT(a.nombre, ' ', a.apellido_paterno, ' ', a.apellido_materno) AS nombre_completo,
                    MAX(CASE WHEN c.unidad = 1 THEN c.calificacion END) AS unidad_1,
                    MAX(CASE WHEN c.unidad = 2 THEN c.calificacion END) AS unidad_2,
                    MAX(CASE WHEN c.unidad = 3 THEN c.calificacion END) AS unidad_3,
                    MAX(CASE WHEN c.unidad = 4 THEN c.calificacion END) AS unidad_4,
                    MAX(CASE WHEN c.unidad = 5 THEN c.calificacion END) AS unidad_5,
                    MAX(CASE WHEN c.unidad = 6 THEN c.calificacion END) AS unidad_6
                FROM alumnos a
                JOIN alumnos_materias am ON a.id_alumno = am.id_alumno
                JOIN materias m ON am.id_materia = m.id_materia
                LEFT JOIN calificaciones c ON a.id_alumno = c.id_alumno AND c.id_materia = m.id_materia
                WHERE m.id_materia = ?
                GROUP BY a.id_alumno
                ORDER BY nombre_completo ASC
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id_materia]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al obtener alumnos"]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(["error" => "Acción no válida"]);
        break;
}
