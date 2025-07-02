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
            $stmt = $pdo->prepare("SELECT id_materia, nombre, unidades FROM materias WHERE id_maestro = ? AND activa = 1");
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
            // Obtener cuántas unidades tiene la materia
            $stmtUnidad = $pdo->prepare("SELECT unidades FROM materias WHERE id_materia = ?");
            $stmtUnidad->execute([$id_materia]);
            $num_unidades = intval($stmtUnidad->fetchColumn());

            // Construir dinámicamente las columnas de unidad_1 a unidad_N
            $campos = [];
            for ($i = 1; $i <= $num_unidades; $i++) {
                $campos[] = "MAX(CASE WHEN c.unidad = $i THEN c.calificacion END) AS unidad_$i";
            }

            $sql = "
                SELECT 
                    m.nombre AS materia,
                    CONCAT(a.nombre, ' ', a.apellido_paterno, ' ', a.apellido_materno) AS nombre_completo,
                    " . implode(", ", $campos) . "
                FROM alumnos a
                JOIN alumnos_materias am ON a.id_alumno = am.id_alumno
                JOIN materias m ON am.id_materia = m.id_materia
                LEFT JOIN calificaciones c ON a.id_alumno = c.id_alumno AND c.id_materia = m.id_materia
                WHERE m.id_materia = ?
                GROUP BY a.id_alumno, m.nombre, a.nombre, a.apellido_paterno, a.apellido_materno
                ORDER BY nombre_completo ASC
            ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id_materia]);
            $alumnos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "unidades" => $num_unidades,
                "alumnos" => $alumnos
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al obtener alumnos"]);
        }
        break;

    case 'guardar_calificaciones':
        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input || !isset($input['id_materia']) || !isset($input['data'])) {
            http_response_code(400);
            echo json_encode(["error" => "Datos incompletos o mal formateados"]);
            exit;
        }

        $id_materia = $input['id_materia'];
        $data = $input['data'];

        try {
            $pdo->beginTransaction();

            foreach ($data as $row) {
                $alumnoNombre = $row['alumno'];
                $calificaciones = $row['calificaciones'];

                // Buscar ID del alumno por nombre completo
                $stmt = $pdo->prepare("
                    SELECT id_alumno 
                    FROM alumnos 
                    WHERE CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno) = ?
                    LIMIT 1
                ");
                $stmt->execute([$alumnoNombre]);
                $id_alumno = $stmt->fetchColumn();

                if (!$id_alumno) {
                    continue;
                }

                foreach ($calificaciones as $i => $calificacion) {
                    $unidad = $i + 1;

                    // REPLACE INTO para insertar o actualizar calificación
                    $stmt = $pdo->prepare("
                        REPLACE INTO calificaciones (
                            id_alumno, id_materia, unidad, calificacion, fecha_registro, fecha_actualizacion
                        ) VALUES (
                            ?, ?, ?, ?, NOW(), NOW()
                        )
                    ");
                    $stmt->execute([
                        $id_alumno,
                        $id_materia,
                        $unidad,
                        $calificacion
                    ]);
                }
            }

            $pdo->commit();
            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(["error" => "Error al guardar calificaciones"]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(["error" => "Acción no válida"]);
        break;
}
