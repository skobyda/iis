<?php

require_once 'backend_functions.php';


$json = file_get_contents('php://input'); // Read POST as raw data

if ($json == "" && isset($_REQUEST['JS']) && $_REQUEST['JS'] != "") {
    $json = $_REQUEST['JS'];
}

$data = json_decode($json, true);


$backend = new Backend;
switch ($data['action']) {
    case 'login':
        $response = $backend->login($data['arguments']);
        break;

    case 'register':
        $response = $backend->register($data['arguments']);
        break;
    
    case 'editPlayer':
        $response = $backend->set_player($data['arguments']);
        break;
    
    case 'getPlayer':
        $response = $backend->get_player($data['arguments']);
        break;
    
    
    
    
    
    
    
    case 'getTournament':
        $response = $backend->get_tournament($data['arguments']);
        break;
    
    case 'getTeam':
        $response = $backend->get_team($data['arguments']);
        break;
    
    case '':
        $response = $backend->error('JSON - action not specified!');
        break;
    
    default:
        $response = $backend->error('Invalid request!');
        break;
}

echo (json_encode($response));
