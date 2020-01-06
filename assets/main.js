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
        $("#place_name").val("All");
        $("#name_section").hide();
        $("#zipcode_section").show();
    }else if(selected=="Name"){
        $("#name_section").show();
        $("#zipcode_section").hide();
    }else{
        $("#place_name").val("All");
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


$("#signin_submit").on("click", function(){
    event.preventDefault();
    var enteredEmail=$("#signin_email").val();
    var enteredPassword=$("#signin_password").val();
   

    for(var i=0; i<localStorage.length; i++){
        var key=localStorage.key(i);
        var expectedEmail=key.slice(key.indexOf("_")+1);
        var expectedPassword=JSON.parse(localStorage.getItem("member_"+enteredEmail)).password;
        if(expectedEmail==enteredEmail && expectedPassword==enteredPassword){
        //localStorage.setItem("Signed in user: "+enteredEmail);
          $("#modal_5 .close").click();

          $("#displayName").text("Hi, "+JSON.parse(localStorage.getItem("member_"+enteredEmail)).name);
          console.log(enteredEmail.slice(0,indexOf("@")));
        }else{
            $("div#errMsg").css("color", "red");
            $("div#errMsg").html("Your email or password is incorrect! Please try again!");
        }
        
    }

})