$("#zipcode_section").hide();
/* * * * * * * Variables * * * * * * */
var type,name,distance,searchArea,zipCode;



/* * * * * * * Functions * * * * * * */

function initSearchVars(){
    distance=$("#distance").val();
    searchArea=$("#searcharea").val();
    zipCode=$("#zipcode").val();
    type=$("#type").val();
    name=$("#place_name").val();

}

function saveSearchVars(){
    localStorage.removeItem("search_vars");
    var obj={
        type: this.type,
        name: this.name,
        distance: this.distance,
        searchArea: this.searchArea,
        zipCode: this.zipCode

    };
    localStorage.setItem("search_vars",JSON.stringify(obj));
}


/* * * * * * * Listeners * * * * * * */
$("#home_search-btn").on("click", function(){
    initSearchVars();
    saveSearchVars();

});

$("#searcharea").on("change",function(){
    if($("#searcharea").val()=="Zip Code"){
    $("#zipcode_section").show();
    }else{
        $("#zipcode_section").hide();
    }
});

// Tsolmon
var favFood=[];
$(document).ready(function(){
    $('.check').click(function(){
        if($(this).prop("checked") == true){
           favFood.push(($(this).val()));
        }
    });
});


$("#subscribeSubmitBtn").on("click", function(){
   
    var obj={
        name: $("#signup_name").val(),
        email: $("#signup_email").val(),
        address: $("#signup_city").val()+", "+$("#signup_state").val(),
        fav_food: favFood,
    };

    localStorage.setItem("member_"+obj.email,JSON.stringify(obj));


  })


