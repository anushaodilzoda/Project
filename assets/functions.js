
/* * * * * * * Variables * * * * * * */
var lon="undefined";
var lat="undefined";
var result="undefined";


/* * * * * * * Functions * * * * * * */

function performSearch(htmlDivId,searchArea,zipCode,distance,type,name,rating){
    var queryUrl;
    
    /*Searching around the user location*/
    if(searchArea=="Current Location"){
        if(lon=="undefined" && lat=="undefined"){
        getUserLocation();
        }
        var interval1=setInterval(function(){
        if(lon!="undefined" && lat!="undefined"){
            clearInterval(interval1);
            queryUrl="https://tripadvisor1.p.rapidapi.com/restaurants/list-by-latlng?limit=100&currency=USD&distance="+distance+"&lunit=mi&lang=en_US&min_rating="+rating+"&latitude="+lat+"&longitude="+lon;
            $.ajax(getAjaxSetting(queryUrl)).done(function (response) {
               result=filterResponse(response,type,name);
               displayResult(htmlDivId,result);
            });
        }
        },500);

    /*Searching by the zipcode*/
    }else{
        // queryUrl="https://us-restaurant-menus.p.rapidapi.com/restaurants/zip_code/"+zipCode;
        // $.ajax(getAjaxSetting(queryUrl)).done(function (response) {
        //     result=filterResponse(response,type,name);
        //     displayResult(htmlDivId,result);
        // });
    }
}
//"https://tripadvisor1.p.rapidapi.com/restaurants/list-by-latlng?limit=50&currency=USD&distance=2&lunit=km&lang=en_US&latitude="+selected_lat+"&longitude="+selected_lon


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
            lon=location.coords.longitude;
            lat=location.coords.latitude;
        });
    }else{
        alert("Geolocation is not supported by this browser.");
    }
 }


 function filterResponse(response,type,name){
    console.log(response);
    console.log("name: "+name);
    console.log("type: "+type);
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
                col21=$("<div>").attr("class","col-md-3"),
                col22=$("<div>").attr("class","col-md-3"),
                col23=$("<div>").attr("class","col-md-3");

            var div1= $("<h4>").attr("class","result").text(result[i].name),
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
                .text(result[i].website);
                

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
            row.append(col1,col2);
            col2.append(col21,col22,col23);
            el.append(row);
        
        }  
    }  
}


var map;
/* following function displays distance of the restaurant in the model window*/
function displayDistance(indexOfRestaurant){
    var selected=result[indexOfRestaurant];

    if(lon=="undefined" && lat=="undefined"){
        console.log("getting user location");
        getUserLocation();
        }
        var interval1=setInterval(function(){
            if(lon!="undefined" && lat!="undefined"){
                clearInterval(interval1);
        var pointA = new google.maps.LatLng(lat, lon),
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
        $("#message").val("Hi,\nThe restaurant that I would like to share with you is:"+
                            "\n\n"+nameToShare+"\n"+address+"\n"+phone+"\n"+websiteToShare+"\n\n"+
                                "* * * Optional: You may want to share more details about your experience as well as the dishes that you would like to recommend. * * *");
    }


    function sendEmail(recieverEmail, subject, message){
        message="<div style=\"font-size: 15px\">"+ message.replace(nameToShare,"<span style=\"font-weight: bold\;font-size: 16px;\">"+nameToShare+"</span>")+"</div>";
        message=message.replace(websiteToShare, "<a style=\"color: blue\" href=\""+websiteToShare+"\">"+websiteToShare+"</a>");
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
        var selected=result[indexOfRestaurant];
        location_id=selected.location_id;
        review_num=selected.num_reviews;
        console.log("location_id: "+location_id);
        console.log("review num: "+review_num);
       
     
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
    




        