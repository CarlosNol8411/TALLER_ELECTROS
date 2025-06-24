<?php
// php/db.php
$host = "localhost";
$dbname = "control_escolar";
$user = "root"; 
$pass = ""; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    // Para mostrar errores (en desarrollo)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión a base de datos: " . $e->getMessage()]);
    exit;
}
?>
