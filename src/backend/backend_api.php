<?php

require_once 'backend_functions.php';



$json = file_get_contents('php://input'); // Read POST as raw data

if ($json == "" && $_REQUEST['JS'] != "") {
    $json = $_REQUEST['JS'];
}

//var_dump($json);

$data = json_decode($json, true);

switch ($data['action']) {
    case 'login':
        $response = login($data['arguments']);
        break;

    case 'register':
        $response = register($data['arguments']);
        break;
    
    case 'getPlayer':
        $response = get_player($data['arguments']);
        break;
    
    case 'getTournament':
        $response = get_tournament($data['arguments']);
        break;
    
    case 'getTeam':
        $response = get_team($data['arguments']);
        break;
    
    default:
        $response = error('Invalid request!');
        break;
}

echo (json_encode($response));
