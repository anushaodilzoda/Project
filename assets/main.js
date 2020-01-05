$("#zipcode_section").hide();
$("#name_section").hide();
/* * * * * * * Variables * * * * * * */
var type,name,distance,searchArea,zipCode,rating;



/* * * * * * * Functions * * * * * * */

function initSearchVars(){
    distance=$("#distance").val();
    searchArea=$("#searcharea").val();
    zipCode=$("#zipcode").val();
    type=$("#type").val();
    name=$("#place_name").val();
    rating=$("#rating").val();
    console.log("rating: "+rating);
}

function saveSearchVars(){
    localStorage.removeItem("search_vars");
    var obj={
        type: this.type,
        name: this.name,
        distance: this.distance,
        searchArea: this.searchArea,
        zipCode: this.zipCode,
        rating: this.rating
    };
    localStorage.setItem("search_vars",JSON.stringify(obj));
}


/* * * * * * * Listeners * * * * * * */
$("#home_search-btn").on("click", function(){
    initSearchVars();
    saveSearchVars();

});

$("#searcharea").on("change",function(){
    var selected=$("#searcharea").val();
    if(selected=="Zip Code"){
        $("#zipcode_section").show();
        $("#name_section").hide();
    }else if(selected=="Name"){
        $("#name_section").show();
        $("#zipcode_section").hide();
    }else{
        $("#name_section").hide();
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

$("#checkAll").click(function(){
    $('input:checkbox').not(this).prop('checked', this.checked);
   
    $(".check").each(function(){
        console.log($(this).val());
        favFood.push($(this).val());
    })
});

$("#subscribeSubmitBtn").on("click", function(){
   
    var obj={
        name: $("#signup_name").val(),
        email: $("#signup_email").val(),
        password: $("#signup_password").val(),
        address: $("#signup_city").val()+", "+$("#signup_state").val(),
        fav_food: favFood,
    };

    localStorage.setItem("member_"+obj.email,JSON.stringify(obj));


  })


