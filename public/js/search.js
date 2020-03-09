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
    if(obj==null){
        $("#loading").hide();
    }else{
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
    selected=result[indexOfRestaurant];
    displayDistance();

});


$("#result_container").on("click",".share_btn",function(){
    event.preventDefault();
    var indexOfRestaurant=$(this).parent().parent().parent().attr("id");
    console.log("clicked: "+indexOfRestaurant);
    autofillEmail(indexOfRestaurant);

});


$("#result_container").on("click",".fa-heart",function(){
    event.preventDefault();
    var indexOfRestaurant=$(this).parent().parent().attr("id");
    console.log("clicked: "+indexOfRestaurant);
    if(localStorage.getItem("Signed in user: ")!=null){
        $(this).attr("class", "fa fa-heart");
        var arr=[];
        var obj= result[indexOfRestaurant];
        arr.push(obj);
        arr.push({user: localStorage.getItem("Signed in user: ")});
       
        console.log(arr);
        $.ajax("/addFav", {
            type: "POST",
            data: {data:arr}
        }).then(function() {
            console.log("Added to favorites");
        });
     }else{
         alert("Please sign in");
     }
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

   
function getImageSrc(location_id,keyWord){
    var queryUrl="https://tripadvisor1.p.rapidapi.com/locations/search?location_id="+location_id+"&limit=30&sort=relevance&offset=0&lang=en_US&currency=USD&units=km&query="+keyWord;
    $.ajax(getAjaxSetting(queryUrl)).done(function (response) {
       console.log(response);
       var src="#";
       try {
          src= response.data[0].result_object.photo.images.original.url;
        }
        catch(err) {
            src= response.data[1].result_object.photo.images.original.url;
        }
        $("#image_in_modal3").attr("src",src);
    });
}


$("#result_container").on("click",".result_name",function(){
    event.preventDefault();
    $("#image_in_modal3").attr("src","assets/images/loading.gif");
    console.log("name was clicked");
    var indexOfRestaurant=$(this).parent().parent().attr("id");
    console.log("index: "+indexOfRestaurant);
    console.log(result[indexOfRestaurant]);
    getImageSrc(result[indexOfRestaurant].location_id,result[indexOfRestaurant].name);
});

$(window).scroll(function() {
    var winScrollTop = $(window).scrollTop();
    var winHeight = $(window).height();
    var floaterHeight = $('#floater').outerHeight(true);
    //true so the function takes margins into account
    var fromBottom = 20;

    var top = winScrollTop + winHeight - floaterHeight - fromBottom;
    $('#floater').css({'top': top + 'px'});
});







