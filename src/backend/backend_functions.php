<?php

require_once 'db_object.php';

class Backend {

    var $database;
    
    var $attr_user_get;
    var $attr_user_set;
    
    var $attr_player_set;
    
    function __construct() {
        $this->database = new DB_Object;
        
        $this->attr_user_get = [
            'email' => 'mail'
        ];
        
        $this->attr_user_set = [
            // API_name => DB_name
            'name' => 'first_name',
            'surname' => 'second_name',
            'password' => 'password',
            'active' => 'active',
            'country' => 'country_code',
            'birthDate' => 'born',
            'gender' => 'sex',
            'photo' => 'photo'
        ];
        
        $this->attr_player_set = [
            'height' => 'height',
            'weight' => 'weight',
            'coach' => 'coach',
            'played_side' => 'played_side'
        ];
    }
    
    function error($message) {
        $arr = [];

        $arr['result'] = 'Error';
        $arr['message'] = $message;

        return $arr;
    }

    function confirm($message) {
        $arr = [];

        $arr['result'] = true;
        $arr['message'] = $message;

        return $arr;
    }
    
    function deny($message) {
        $arr = [];

        $arr['result'] = false;
        $arr['message'] = $message;

        return $arr;
    }
    
    function login($data) {
        
        // Is email valid?
        $cnt = $this->database->count('user_', ['mail' => $data['email']]);
        
        if ($cnt !== '1') {
            return $this->error("Invalid email! Found $cnt matches.");
        }
        
        // Is password valid?
        if ($this->correct_pass($data['email'], $data['password'])) {
            return $this->confirm('Login succesful.');
        }
        else {
            return $this->deny('Invalid password.');
        }
    }

    function register($data) {

        if ($this->database->count('user_', ['mail' => $data['email']]) === '0') {
            
            $result = $this->database->insert('user_', 
                    [
                        'mail',
                        'password'
                    ], 
                    [
                        $data['email'],
                        $data['password']
                    ]
            );

            if ($result === false) {
                return $this->error('Database error.');
            }
            
            return $this->confirm('Registration succesful.');
        }

        return $this->deny('Email or name already used.');
    }

    function set_player($data) {
        $values = [];
        
        foreach ($this->attr_user_set as $api_name => $db_name) {
            if (isset($data[$api_name])) {
                $values[$db_name] = $data[$api_name];
            }
        }
        
        if (count($values) == 0) {
            return $this->error('No values to change!');
        }
        
        $conditions = [];
        foreach ($this->attr_user_get as $api_name => $db_name) {
            if (isset($data[$api_name])) {
                $conditions[$db_name] = $data[$api_name];
            }
        }
        
        if (count($conditions) == 0) {
            return $this->error('User not specified!');
        }
        
        $result = $this->database->update('user_', $values, $conditions);
        
        if ($result === false) {
            return $this->error('Database error!');
        }
        
        return $this->confirm('Change successful.');
    }
    
    
    
    function get_player($data) {
        $columns = [
            'first_name',
            'second_name',
            'mail',
            'country_code',
            'born',
            'sex',
            'photo',
            'actual_p_rank',
            'highest_p_rank',
            'height',
            'weight',
            'played_side',
            'coach'
        ];
        
        if (count($data) === 1 && $data[0] == 'all') {
            $conditions = 'active=1';
        }
        else {
            $conditions = 'mail IN (' . $this->database->arr_to_string($data) . ')';
        }
        
        // SELECT * FROM user_ LEFT JOIN player ON player.user_id = user_.id WHERE sex="N"
        $result = $this->database->select_join(['user_', 'player'], 'LEFT', 'player.user_id = user_.id', $columns, $conditions);

        return $result;
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

    function correct_pass($email, $password) {
        $row = $this->database->select('user_', 'password', ['mail' => $email], true);

        return $password == $row['password'];
    }

}