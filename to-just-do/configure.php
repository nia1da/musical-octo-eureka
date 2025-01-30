<?php
$dbhost ="localhost";
$dbname="to-just-do";
$username = "root";
$password="";

try{
$connection=new  PDO("mysql:host=$dbhost;dbname=$dbname;charset=utf8", $username, $password);

$connection-> setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
echo "connection succesful";

}
catch(PDOException $ex){
    die("connection fault: ".$ex->getMessage());
}

?>

