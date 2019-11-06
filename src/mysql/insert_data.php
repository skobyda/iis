<?php
$mysqli =new mysqli('localhost', 'root','pasword943','IIS1');
if($mysqli->connect_error)
    die("connect error");

$fn = fopen("insert.txt","r");
$i=0;
while($result=fgets($fn,850)){
    echo $result;
    if ($mysqli->query($result) === TRUE) {
        print("Inserted.\n\n");
    }
    else{
        $i++;
        print("error \n");
    }
}
print("$i errors");
fclose($fn);
$mysqli->close();
// 5 errors should be now (last five lines in file are bad on purpose)