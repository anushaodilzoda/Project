initStoredSearch();
/* * * * * * * elements * * * * * * */

$("#custom_email").hide();
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

function initStoredSearch(){
    var obj=JSON.parse(localStorage.getItem("search_vars"));
    type=obj.type;
    name=obj.name;
    distance=obj.distance;
    searchArea=obj.searchArea;
    zipCode=obj.zipCode;
    rating=obj.rating;
    setTimeout(function(){
        performSearch("result_container",searchArea,zipCode,distance,type,name,rating);
    }, 300);
}


/* * * * * * * Listeners * * * * * * */

$("#search-btn").on("click",function(){
    $("#result_container").hide();
    $("#loading").show();
    event.preventDefault();
    setTimeout(function(){
        initSearchVars();
        performSearch("result_container",searchArea,zipCode,distance,type,name,rating);
    }, 300);

});

$("#searcharea").on("change",function(){
    var selected=$("#searcharea").val();
    if(selected=="Zip Code"){
       $( "#zipcode" ).prop( "disabled", false ).css("background-color","white");
    }else{
        $( "#zipcode" ).prop( "disabled", true ).css("background-color","#6b6868");
    }
});

$("#result_container").on("click",".reviews_btn",function(){
    event.preventDefault();
    var indexOfRestaurant=$(this).parent().parent().parent().attr("id");
    console.log("clicked: "+indexOfRestaurant);
    displayReview(indexOfRestaurant);
});

$("#result_container").on("click",".direction_btn",function(){
    event.preventDefault();
    var indexOfRestaurant=$(this).parent().parent().parent().attr("id");
    console.log("clicked: "+indexOfRestaurant);
    displayDistance(indexOfRestaurant);

});


$("#result_container").on("click",".share_btn",function(){
    event.preventDefault();
    var indexOfRestaurant=$(this).parent().parent().parent().attr("id");
    console.log("clicked: "+indexOfRestaurant);
    autofillEmail(indexOfRestaurant);

});


$("#email_recievers").on("change",function(){
    if($("#email_recievers").val()=="Custom Email Address"){
        $("#custom_email").show();
        }else{
            $("#custom_email").hide();
        }
});

$("#email_send_btn").on("click",function(){
   var recieverType=$("#email_recievers").val();
   var recieverEmail="";
   var subject=$("#subject").val(),
   message=$("#message").val();
   message= message.split("\n").join("</br>");
    if(recieverType=="Custom Email Address"){
        recieverEmail=$("#custom_email").val();
        prepAndSendEmail(recieverEmail,subject,message);
    }else{
        for(var i=0; i<localStorage.length; i++){
            var key=localStorage.key(i);
            if(key.startsWith("member")){
             var email=JSON.parse(localStorage.getItem(key)).email;
               prepAndSendEmail(email,subject,message);
            //WIP community email list as recievers
            }

        }

    }
})




