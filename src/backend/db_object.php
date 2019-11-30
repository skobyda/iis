<?php

class DB_Object {

    var $pdo;
    
    function __construct() {
        $dsn = 'mysql:dbname=iis1;host=127.0.0.1';
        $user = 'root';
        $passwd = '';
    
        $this->pdo = new PDO($dsn, $user, $passwd);
    }

    function select($table, $columns = '*', $conditions = null, $single = false) {
        
        $sql = "SELECT " 
            . "$columns "
            . ($table ? "FROM $table " : "") 
            . ($conditions ? "WHERE " . $this->arr_to_string($conditions, true) : "");
        
        $result = $this->pdo->query($sql);
        
        if ($result === false) {
            return false;
        }
        
        if ($single) {
            return $result->fetch(PDO::FETCH_ASSOC);
        }
        
        $data = [];
        
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }
        
        return $data;
    }
    
    function select_join($tables, $type, $join_cond, $columns, $conditions) {
        
        // SELECT * FROM user_ LEFT JOIN player ON player.user_id = user_.id WHERE sex="N"
        $table_str = '';
        $first = true;
        foreach ($tables as $table) {
            if (!$first) {
                $table_str .= " $type JOIN ";
            }
            
            $table_str .= $table;
            
            $first = false;
        }
        
        $columns = $this->arr_to_string($columns, false, '');
        
        $sql = "SELECT " 
            . "$columns "
            . "FROM $table_str "
            . "ON $join_cond " 
            . "WHERE $conditions";
        
        $result = $this->pdo->query($sql);
        
        if ($result === false) {
            return false;
        }
        
        $data = [];
        
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }
        
        return $data;
    }
    
    function count($table, $conditions) {
        $result = $this->select($table, 'COUNT(*) as CNT', $conditions, true);
        
        if ($result === false) {
            return false;
        }
        
        return $result['CNT'];
    }
    
    function insert($table, $columns, $values) {
        
        $sql = "INSERT INTO "
            . "$table "
            . "(" . $this->arr_to_string($columns, false, '') . ") "
            . "VALUES "
            . "(" . $this->arr_to_string($values) . ") ";
        
        $result = $this->pdo->query($sql);
        
        if ($result === false) {
            return false;
        }
        
        return $this->pdo->lastInsertId();
    }
    
    function update($table, $values, $conditions) {
        
        $sql = "UPDATE "
            . "$table "
            . "SET "
            . $this->arr_to_string($values, true)
            . "WHERE "
            . $this->arr_to_string($conditions, true);
        
        $result = $this->pdo->query($sql);
        
        if ($result === false) {
            return false;
        }
        
        return true;
    }
    
    function arr_to_string($arr, $with_keys = false, $quotes = '"') {
        $string = '';
        
        $first = true;
        foreach ($arr as $key => $value) {
            $string .= ($first ? '' : ', ') 
                    . ($with_keys ? "$key=" : '') 
                    . (is_string($value) ? $quotes . $value . $quotes : $value);
            
            $first = false;
        }
        
        $string .= ' ';
        
        return $string;
    }
}