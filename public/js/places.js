//  searchPlaces("fun");
$("#loading").hide();

function searchPlaces(keyWord){
    var location_id=localStorage.getItem("location_id");
    if(location_id==null){
        location_id=3687382;
    }
    var queryUrl="https://tripadvisor1.p.rapidapi.com/locations/search?location_id="+location_id+"&limit=30&sort=relevance&offset=0&lang=en_US&currency=USD&units=km&query="+keyWord;
    $.ajax(getAjaxSetting(queryUrl)).done(function (response) {
        console.log(response);
        displayPlacesResult("places_result_container",response)
    });
}

function displayPlacesResult(htmlDivId,res){
    res=res.data;
    result=res;
    $("#loading").hide();
    $("#places_result_container").show();
    var domEl=document.getElementById(htmlDivId);
    var el=$(domEl);
    el.empty();
    if(res.length==0){
        el.css("color","#e46509");
        el.text("No matching result");
    }else{
        for(i in res){
            if(!res[i].result_object.photo){continue;}
            var row=$("<div>").attr("class","row container_div shadow rounded").attr("id",i),
                col1=$("<div>").attr("class","col-md-7 col1"),
                col2=$("<div>").attr("class","row col-md-5 tool_row"),
                col3=$("<a>").attr("href","#").attr("class", "heart_sign"),
                heart_img=$("<i>").attr("class","far fa-heart"),
                col21=$("<div>").attr("class","col-md-3"),
                col22=$("<div>").attr("class","col-md-3"),
                col23=$("<div>").attr("class","col-md-3");
                

            var div1=$("<a>")
            .attr("class","result result_name")
            .attr("href","#")
            .attr("value",res[i].result_object.photo.images.original.url)
            .attr("data-toggle","modal")
            .attr("data-target","#modal_3")
            .text(res[i].result_object.name);

                span=createStarRating(res[i].result_object.rating),
                div2=$("<div>").attr("class","result").text("Type: "+res[i].result_object.category.name);
                div3= $("<div>").attr("class","result").text("Address: "+res[i].result_object.address);
                div4= $("<div>").attr("class","result").text("Customer says:");
                div5=$("<div>").attr("class","result q_review").text("-- "+res[i].review_snippet.snippet);
                
                

            var img0=$("<img>").attr("src","assets/images/reviews.png").attr("class","reviewsImg shadow mb-5 bg-white rounded");
            var btn0=$("<a>")
                .attr("class","reviews_btn btn btn-full")
                .attr("href","#")
                .attr("data-toggle","modal")
                .attr("data-target","#modal_0")
                .text("Reviews");

            var img1=$("<img>").attr("src","assets/images/GoogleMap.jpeg").attr("class","googleImg shadow mb-5 bg-white rounded");
            var btn1=$("<a>")
                .attr("class","direction_btn btn btn-full")
                .attr("href","#")
                .attr("data-toggle","modal")
                .attr("data-target","#modal_1")
                .text("Directions");

            var img2=$("<img>").attr("src","assets/images/share.png").attr("class","shareImg shadow mb-5 bg-white rounded");
            var btn2=$("<a>")
                .attr("class","share_btn btn btn-full")
                .attr("href","#")
                .attr("data-toggle","modal")
                .attr("data-target","#modal_2")
                .text("Share");


            col1.append(div1,span,div2,div3,div4,div5);
            col21.append(img0,btn0);
            col22.append(img1,btn1);
            col23.append(img2,btn2);
            col3.append(heart_img);
            row.append(col1,col2,col3);
            col2.append(col21,col22,col23);
            el.append(row);
        
        }  
    }  
}


$("#place_search_btn").on("click",function(){
    event.preventDefault();
    var keyword=$("#search_keyword").val();
    searchPlaces(keyword);
})

$(".quickSearch").on("click", function(){
    event.preventDefault();
    var value=$(this).html();
    console.log("val: "+value);
    $("#loading").show();
    searchPlaces(value);
});

$("#places_result_container").on("click",".result_name",function(){
    event.preventDefault();
    console.log("name was clicked");
    var value=$(this).attr("value");
    console.log("image src: "+value);
    $("#image_in_modal3").attr("src",value);
});

$("#places_result_container").on("click",".reviews_btn",function(){
    event.preventDefault();
    var indexOfRestaurant=$(this).parent().parent().parent().attr("id");
    console.log("clicked: "+indexOfRestaurant);
    selected=result[indexOfRestaurant].result_object;
    retrieveReviews(selected.location_id,selected.num_reviews);
});

$("#places_result_container").on("click",".direction_btn",function(){
    event.preventDefault();
    var indexOfRestaurant=$(this).parent().parent().parent().attr("id");
    console.log("clicked: "+indexOfRestaurant);
    selected=result[indexOfRestaurant].result_object;
    displayDistance();

});


$("#places_result_container").on("click",".share_btn",function(){
    event.preventDefault();
    var indexOfRestaurant=$(this).parent().parent().parent().attr("id");
    console.log("clicked: "+indexOfRestaurant);
    autofill(result[indexOfRestaurant].result_object);

});

$("#places_result_container").on("click",".fa-heart",function(){
    event.preventDefault();
    var indexOfRestaurant=$(this).parent().parent().attr("id");
    console.log("clicked: "+indexOfRestaurant);
    if(localStorage.getItem("Signed in user: ")!=null){
        $(this).attr("class", "fa fa-heart");
        var arr=[];
        var obj= result[indexOfRestaurant].result_object;
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
            }
        }
    }
})

function autofill(obj){
        if(localStorage.getItem("Signed in user: ")!=null){
            $("#message").val("Hi, This is "+getSignedUserName()+".\n\nI would like to share with you:"+
            "\n\n"+obj.name+"\n"+obj.address+"\n\n"+
                "* * * Optional: You may want to share more details about your experience as well as the dishes that you would like to recommend. * * *");
        }else{
            $("#message").val("Hi,\nI would like to share with you:"+
                                "\n\n"+obj.name+"\n"+obj.address+"\n\n"+
                                    "* * * Optional: You may want to share more details about your experience as well as the dishes that you would like to recommend. * * *");
        }
   }
