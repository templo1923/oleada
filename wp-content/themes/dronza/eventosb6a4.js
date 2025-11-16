jQuery(document).ready(function ($) {
    $("#botonp").on("click", function(){
    $nombre = $("#namefull").val();
    $correo = $("#mailfull").val();
    
    if(!$nombre && !$correo){
        $("#mensaje").append("**El nombre completo y correo electrónico son obligatorios");
    }else{
        window.location.href = "https://gestor.tvmagis.info/service/createuserp/"+$nombre+"/"+$correo;
    }
    
    });
    
});