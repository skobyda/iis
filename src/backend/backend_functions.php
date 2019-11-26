<?php

function error($message) {
    $arr = [];
    
    $arr['result'] = 'Error';
    $arr['data']['message'] = $message;
    
    return $arr;
}

function login($data) {
    if (correct_pass($data['email'], $data['password'])) {
        $arr['result'] = true;
        $arr['message'] = 'Login succesful.';
        
        return $arr;
    }
    else {
        $arr['result'] = false;
        $arr['message'] = 'Invalid password.';
        
        return $arr;
    }
}

function register($data) {
    
    if (is_available('email', $data['email']) 
        && is_available('nick', $data['nick'])) {
        
        //SQL registering user with email, nick, password, gender, birthdate
    
        $arr['result'] = true;
        $arr['message'] = 'Registration succesful.';

        return $arr;
    }
    
    $arr['result'] = false;
    $arr['message'] = 'Name already used.';

    return $arr;
}

function get_player($params) {
    $count = 5;
    
    for($idx = 0; $idx < $count; $idx++) {
        $player = [];
        $player['nick'] = 'Nick' . $idx;
        $player['name'] = 'Nick Nickelson';
        $player['country'] = 'PL';
        $player['ref_rating'] = 8;
        $player['teams'] = ['Ninjas' . $idx, 'Pyjamas' . ($idx+1)];
        $player['born'] = '11-' . $idx . '-1988';
        $player['curr_player_rank'] = $idx + 2;
        $player['sex'] = ($idx % 2 == 0) ? 'Male' : 'Female';
        $player['highest_player_rank'] = $idx + 1;
        
        $arr[] = $player;
    }
    
    return $arr;
}

function get_team($params) {
    $count = 3;
    
    for($idx = 0; $idx < $count; $idx++) {
        $team = [];
        $team['name'] = 'Dream Team' . ($idx+1);
        $team['players'] = ['Nick1', 'Nick2', 'Nick3'];
        $team['founded'] = '08-' . $idx . '-2018';
        
        $arr[] = $team;
    }
    
    return $arr;
}

function get_tournament($params) {
    $count = 1;
    
    for($idx = 0; $idx < $count; $idx++) {
        $tournament['name'] = 'KATOWICE 202' . $idx;
        $tournament['prices'] = 'Moneyyy, bro!';
        $tournament['registrationFee'] = 'FREE Kappa';
        $tournament['category'] = [
            'age' => 'Junior', 
            'sex' => 'Male'
            ];
        $tournament['numOfTeams'] = 8;
        $tournament['teamSize'] = 5;
    
        $arr[] = $tournament;
    }
    
    return $arr;
}



function is_available($type, $content) {
    // TODO: handle using DB
    return true;
}

function correct_pass($email, $password) {
    // TODO: handle using DB
    return $email != $password;
}
