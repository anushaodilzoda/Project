
/* * * * * * * Variables * * * * * * */
var lon="undefined";
var lat="undefined";
var userLon="undefined";
var userLat="undefined";
var result="undefined";
var selected="undefined";
var favList=[];

//localStorage.clear();

/* * * * * * * Functions * * * * * * */

function performSearch(htmlDivId,searchArea,zipCode,distance,type,name,rating){
    var queryUrl;

    /*Searching around the user location*/
    if(searchArea=="Current Location"){
        if(lon=="undefined" && lat=="undefined"){
            getUserLocation();
        }
        var interval3=setInterval(() => {
            if(userLon!="undefined" && userLat!="undefined"){
            lon=userLon; 
            lat=userLat; 
            clearInterval(interval3);
            }
        }, 200);

    }else{
            var geocoder = new google.maps.Geocoder();
            var address = zipCode;
            geocoder.geocode({ 'address': 'zipcode '+address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                  lat = results[0].geometry.location.lat();
                  lon = results[0].geometry.location.lng();
                } else {
                    alert("Request failed.")
                }
            });
        
        }
        var interval1=setInterval(function(){
        if(lon!="undefined" && lat!="undefined"){
            clearInterval(interval1);
            queryUrl="https://tripadvisor1.p.rapidapi.com/restaurants/list-by-latlng?limit=100&currency=USD&distance="+distance+"&lunit=mi&lang=en_US&min_rating="+rating+"&latitude="+lat+"&longitude="+lon;
            $.ajax(getAjaxSetting(queryUrl)).done(function (response) {
               result=filterResponse(response,type,name);
               localStorage.setItem("location_id", result[0].location_id);
               displayResult(htmlDivId,result);
            });
        }
        },500);
}


function getAjaxSetting(queryUrl){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": queryUrl,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
            "x-rapidapi-key": "27228f3928mshecf3768460bfdd6p1a3d7fjsn04c99c07c026"
        }
    }
    return settings;
}


function getUserLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(location){
            userLon=location.coords.longitude;
            userLat=location.coords.latitude;
        });
    }else{
        alert("Geolocation is not supported by this browser.");
    }
 }


 function filterResponse(response,type,name){
    console.log(response);
    var arr=response.data;
    var newArr=[];
    if(type=="All" && name=="All"){
        return arr;
    }else if(type!="All" && name!="All"){
        name=name.toLowerCase();
        for(i in arr){
            var cuisineStr="";
            /*making cuisines a array*/
            for(j in arr[i].cuisine){
                cuisineStr=cuisineStr+arr[i].cuisine[j].name+",";
            }
            var tempName=arr[i].name;
            if(tempName!=null){
            tempName=tempName.toLowerCase();
            if(cuisineStr.includes(type) && tempName.includes(name)){ 
            newArr.push(arr[i]);
         }
        }
      }
      return newArr; 
    }else if(type!="All"){
        for(i in arr){
            var cuisineStr="";
            /*making cuisines a array*/
            for(j in arr[i].cuisine){
                cuisineStr=cuisineStr+arr[i].cuisine[j].name+",";
            }
            if(cuisineStr.includes(type)){ 
            newArr.push(arr[i]);
             }
        }
        return newArr;
    }else{
        console.log("name from seach box: "+name);
        name=name.toLowerCase();
        for(i in arr){
            var tempName=arr[i].name;
            if(tempName!=null){
             tempName=tempName.toLowerCase();
            if(tempName.includes(name)){ 
            newArr.push(arr[i]);
            }
         }
        }
         return newArr;
    }

} //filterResponse function end

function displayResult(htmlDivId,result){
    $("#loading").hide();
    $("#result_container").show();
    var domEl=document.getElementById(htmlDivId);
    var el=$(domEl);
    el.empty();
    if(result.length==0){
        el.css("color","#e46509");
        el.text("No matching result");
    }else{
        for(i in result){
            if(result[i].address==null || 
                result[i].name.includes("7-Eleven") || 
                    result[i].name.includes("Subway") || 
                        result[i].name.includes("Dunkin") || 
                            result[i].phone==null)
                                        { continue; }
            var cuisinesStr="";
            /*making cuisines a array*/
            for(j in result[i].cuisine){
                cuisinesStr= cuisinesStr+(result[i].cuisine[j].name)+",";
            }

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
                .attr("data-toggle","modal")
                .attr("data-target","#modal_3")
                .text(result[i].name);

                span=createStarRating(result[i].rating),
                div2= $("<div>").attr("class","result").text("Address: "+result[i].address),
                div3= $("<div>").attr("class","result").text("Cuisines: "+cuisinesStr),
                div4= $("<div>").attr("class","result").text("Phone: "+result[i].phone),
                div5= $("<div>").attr("class","result").text("Price Range: "+result[i].price_level),
                div6= $("<div>").attr("class","result").text("Open now: "+result[i].open_now_text),
                div7= $("<a>")
                .attr("href",result[i].website)
                .attr("class","result website")
                .attr("target","_blank")
                .text(result[i].website).text("View our site");
                

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


            col1.append(div1,span,div2,div3,div4,div5,div5,div6,div7);
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



var map;
/* following function displays distance of the restaurant in the model window*/
function displayDistance(){
    if(userLon=="undefined" && userLat=="undefined"){
        console.log("getting user location");
        getUserLocation();
        }
        var interval1=setInterval(function(){
            if(userLon!="undefined" && userLat!="undefined"){
                clearInterval(interval1);
                console.log("user location: "+userLat+" "+userLon);
                console.log("place location: "+selected.latitude+" "+selected.longitude);
        var pointA = new google.maps.LatLng(userLat, userLon),
            pointB = new google.maps.LatLng(selected.latitude, selected.longitude),
            myOptions = {
            zoom: 10,
            center: pointA
            },
            map = new google.maps.Map(document.getElementById('map'), myOptions),
            // Instantiate a directions service.
            directionsService = new google.maps.DirectionsService();
            directionsDisplay = new google.maps.DirectionsRenderer({
            map: map
            });

        // get route from A to B
        calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB); 
                
            }
        },500); 
    }
          
function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
    directionsService.route({
        origin: pointA,
        destination: pointB,
        travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
        console.log("google map result");
        console.log(response);
        $("#duration_status").html(response.routes[0].legs[0].duration.text);
        $("#distance_status").html(response.routes[0].legs[0].distance.text);
        if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        } else {
        window.alert('Directions request failed due to ' + status);
        }
    });
    }
    
    var nameToShare, websiteToShare;
    function autofillEmail(indexOfRestaurant){
        var selected=result[indexOfRestaurant],
            address=selected.address,
            websiteToShare=selected.website,
            phone=selected.phone;
            nameToShare=selected.name
            if(localStorage.getItem("Signed in user: ")!=null){
                $("#message").val("Hi, This is "+getSignedUserName()+".\n\nThe restaurant that I would like to share with you is:"+
                "\n\n"+nameToShare+"\n"+address+"\n"+phone+"\n"+websiteToShare+"\n\n"+
                    "* * * Optional: You may want to share more details about your experience as well as the dishes that you would like to recommend. * * *");
            }else{
                $("#message").val("Hi,\nThe restaurant that I would like to share with you is:"+
                                    "\n\n"+nameToShare+"\n"+address+"\n"+phone+"\n"+websiteToShare+"\n\n"+
                                        "* * * Optional: You may want to share more details about your experience as well as the dishes that you would like to recommend. * * *");
            }
       }


    function prepAndSendEmail(recieverEmail, subject, message){
        message="<div style=\"font-size: 15px\">"+ message.replace(nameToShare,"<span style=\"font-weight: bold\;font-size: 16px;\">"+nameToShare+"</span>")+"</div>";
        message=message.replace(websiteToShare, "<a style=\"color: blue\" href=\""+websiteToShare+"\">"+websiteToShare+"</a>");
        sendEmail(recieverEmail,subject,message);
    }

    function sendEmail(recieverEmail, subject, message){
        Email.send({
            SecureToken : "c9c33f53-4b8f-4442-b581-b569cffe90a3 ",
            To : recieverEmail,
            From : "greatfoodandplaces@gmail.com",
            Subject : subject,
            Body : message
        }).then(
          message => console.log("message sent")
        );
        
    }


    function displayReview(indexOfRestaurant){
        var location_id, review_num, rating;
        /* retrieving the location id, number of reviews and rating*/
        selected=result[indexOfRestaurant];
        location_id=selected.location_id;
        review_num=selected.num_reviews;
        console.log("location_id: "+location_id);
        console.log("review num: "+review_num);
       retrieveReviews(location_id,review_num);
    }
     
    function retrieveReviews(location_id, review_num){
        $("#review_container").empty();
        /* retrieving the reviews*/
        var queryUrl="https://tripadvisor1.p.rapidapi.com/reviews/list?limit="+review_num+"&currency=USD&lang=en_US&location_id="+location_id;
        $.ajax(getAjaxSetting(queryUrl)).done(function (response) {
            console.log(response);
            response=response.data;
            $("#review_modal_title").html(selected.name+" "+createStarRating(selected.rating));

            for(var i=0; i<response.length; i++){
                var date=(response[i].published_date);
                date=date.substring(0,date.indexOf("T"));
                date=$("<div>").attr("class","published_date").html(date+createStarRating(response[i].rating));
                var title=$("<div>").attr("class", "review_title").text(response[i].title);
                var text=$("<div>").attr("class","review_text").text(response[i].text);
                $("#review_container").append($("<div>").attr("class","each_review").append(date,title,text));
            }
        });
    }


    function createStarRating(value){
        var html="<span class=\"rating_value\">"+value+"</span>";
        var wholeNum=value-(value%1);
        for(var i=0; i<wholeNum; i++){
            html+="<span class=\"fa fa-star rating\"></span>";
        }
        if(value%1>0){
            html+="<span class=\"fa fa-star-half rating\"></span>";
        }
        return html;
    }

    function submitNewComment(name, comment){
        var parentEl=$("#row-testimonials");
        var child=$("<div>").attr("class","col span-1-of-3");
        var quote=$("<blockquote>").text(comment);
        var image=$("<img>").attr("src","assets/images/avatar.jpeg");
        var label=$("<label>").text(name);
        var cite=$("<cite>").append(image,label);
        child.append(quote,cite);
        parentEl.prepend(child);
       $("#row-testimonials div:eq(3)").remove();

    }

    function displaySavedComments(){
        for(var i=0; i<localStorage.length; i++){
            var key=localStorage.key(i);
            if(key!=null){
            if(key.startsWith("comment")){
                var newkey=key.substring(key.indexOf("_")+1);
                submitNewComment(newkey,localStorage.getItem(key));
            }
        }
        }
    }
    

    function addDefaultUSers(){
        var users=["Hatem","Khaliunaa","Anusha","Tsoomoo"];
        var emails=["Hatem@yahoo.com","Khaliunaa@yahoo.com","Anusha@yahoo.com","Tsoomoo@yahoo.com"];
        for(var i=0; i<users.length; i++){
        var obj={
            name: users[i],
            email: emails[i],
            password: 12345678,
            address: "Alexandria , VA",
            fav_food: ["American","Chinese"]
        };
        localStorage.setItem("member_"+obj.email,JSON.stringify(obj));
    }
    
    }

    function getObjByEmail(email){
        var matchingObj= JSON.parse(localStorage.getItem("member_"+email));;
        return matchingObj;
     }

    function getSignedUserName(){
        if(localStorage.getItem("Signed in user: ")!=null){
            console.log("getting name");
        var userObj=getObjByEmail(localStorage.getItem("Signed in user: "));
        return userObj.name;
        }
    }

    

  



