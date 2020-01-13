
displaySignedinUser();
displaySavedComments();
addDefaultUSers();
$( "#zipcode" ).prop( "disabled", true ).css("background-color","#6b6868");
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

//search by type Hatem
$(".meal-photo").on("click", function(){

  //  performSearch(type == "chinese");
  console.log("has been clicked!");

});

/* * * * * * * Listeners * * * * * * */
$("#home_search-btn").on("click", function(){
    initSearchVars();
    saveSearchVars();

});

$("#searcharea").on("change",function(){
    var selected=$("#searcharea").val();
    if(selected=="Zip Code"){
       $( "#zipcode" ).prop( "disabled", false ).css("background-color","white");
    }else{
        $( "#zipcode" ).prop( "disabled", true ).css("background-color","#6b6868");
    }
});

// Tsolmon
function displaySignedinUser(){
var signedInUser = localStorage.getItem("Signed in user: ");
if(signedInUser!=null){
    var obj=getObjByEmail(signedInUser);
    $("#displayName").text("Hi, "+obj.name);
    $("#contact_name").val(obj.name);
    $("#contact_email").val(obj.email);
}

}


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
    //event.preventDefault();
    var enteredEmail=$("#signin_email").val();
    var enteredPassword=$("#signin_password").val();
   
if(getObjByEmail(enteredEmail)!=null){
    for(var i=0; i<localStorage.length; i++){
        var key=localStorage.key(i);
        var expectedEmail=key.slice(key.indexOf("_")+1);
        var expectedPassword=getObjByEmail(enteredEmail).password;
        if(expectedEmail==enteredEmail && expectedPassword==enteredPassword){
        
        localStorage.setItem("Signed in user: ", enteredEmail);
          $("#modal_5 .close").click();

          $("#displayName").text("Hi, "+getObjByEmail(enteredEmail).name);
        }else{
            $("div#errMsg").css("color", "red");
            $("div#errMsg").html("Your email or password is incorrect! Please try again!");
        }
        
    }
}else{
    $("div#errMsg").css("color", "red");
    $("div#errMsg").html("No such user, Please sign up!");

}

})


$("#add_comment_btn").on("click",function(){
    event.preventDefault();
    $("#comment_name").val(getSignedUserName());
    
})


$("#save_comment_btn").on("click", function(){
    event.preventDefault();
    var name=$("#comment_name").val();
    var comment=$("#comment_message").val();
    localStorage.setItem("comment_"+name, comment);
    submitNewComment(name,comment);

})

$("#signout_button").on("click", function(){
    localStorage.removeItem("Signed in user: ");
    location.reload();
})





$("#contact_send_btn").on("click", function(){
event.preventDefault();
   let name= $("#contact_name");
   let email=$("#contact_email");
   let reason=$("#contact_reason");
   let message=$("#contact_message");
   if(email.val()=="" && message.val()==""){
    setTimeout(function(){
        $("#contact_status_error").text("");
       },4000);
       $("#contact_status_error").text("Email and Message cannot be empty");
   }else{
      sendEmail("hakuban@yahoo.com","Customer contact-"+reason.val(),"From: </br>"+name.val()+"</br>"+email.val()+"</br></br>"+message.val());
   name.val("");
   email.val("");
   reason.val("");
   message.val("");
   setTimeout(function(){
    $("#contact_status").text("");
   },4000);
   $("#contact_status").text("Sent");
}
});


$(".meal-photo").on("click", function(){
    event.preventDefault();
    var value=$(this).find("div").html();
    console.log("val: "+value);
    $("#type").val(value);
    clickSearch();
});
function clickSearch(){
    document.getElementById("home_search-btn").click();

}

