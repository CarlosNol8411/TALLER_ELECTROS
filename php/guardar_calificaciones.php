case 'guardar_calificaciones':
    $input = json_decode(file_get_contents("php://input"), true);
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
                continue; // si no encuentra el alumno, pasa al siguiente
            }

            foreach ($calificaciones as $i => $calificacion) {
                $unidad = $i + 1;

                // REPLACE INTO para insertar o actualizar
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
