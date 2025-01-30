<?php
require 'configure.php';

if($_SERVER["REQUEST_METHOD"]=="POST"){
    $username=$_POST["user-name"];
    $name=$_POST["full-name"];
    $password=$_POST["password"];

    try{
        $statement=$connection->prepare("select user_id from users where username = ?");
        $statement->execute([$username]);

        if($statement->rowCount()>0){
            echo "username already in use";
            exit;

        }
        $hashed_password=password_hash($password,PASSWORD_DEFAULT);
        $statement=$connection->prepare("insert into users (username,password,name) values (?,?,?)");
        if($statement->execute([$username,$hashed_password,$name])){
            echo "registration succesful";

        }
        else {
            echo "registration unsuccesful,try again";

        }

    }
    catch(PDOException $ex){
        echo "error". $ex->getMessage();

    }
}
?>