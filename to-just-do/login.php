<?php
require 'configure.php';
session_start();

if($_SERVER["REQUEST_METHOD"]=="POST"){
    $username=$_POST["user-name"];
    $password=$_POST["password"];

    try{
        $statement=$connection->prepare("select user_id,password,name from users where username =?");
        $statement->execute([$username]);
        $user=$statement ->fetch(PDO::FETCH_ASSOC);

        if($user && password_verify($password,$user["password"])){
            $_SESSION["user_id"]=$user["user_id"];
            $_SESSION["name"]=$user["name"];
            header("Location: dashboard.html");
            exit;

        }
        else{
            echo "username or password is wrong";

        }

    }
    catch(PDOException $ex){
        echo "error " . $ex->getMessage();

    }
}
?>