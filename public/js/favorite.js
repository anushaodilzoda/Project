
pullFav();

function pullFav(){
    console.log("pulling fav");
    var currentUser=localStorage.getItem("Signed in user: ");

    $.ajax("/pullDb", {
        type: "POST",
        data: {user:currentUser}
    }).then(function(res) {
        var str=res[0].user_favorites;
        console.log("fav to display:"+str);
        $("#loading").hide();
        if(str!=null){
            var arr=str.slice(0, -1).split(",");
            prepResult(arr);
        }else{
            $("#fav_result_container").html("No favorites to display").css("text-align","center");
        }
       
    });

}

function prepResult(arr){
    for(var i=0; i<arr.length; i++){
        var each=arr[i].split(":");
     
            var location_id=each[0].trim();
            var keyWord=each[1].trim();
            console.log(location_id+"=="+keyWord);
              var queryUrl="https://tripadvisor1.p.rapidapi.com/locations/search?location_id="+location_id+"&limit=1&sort=relevance&offset=0&lang=en_US&currency=USD&units=km&query="+keyWord;
              $.ajax(getAjaxSetting(queryUrl)).done(function (response) {
                  console.log(response);
                  displayFavResult("fav_result_container",response);
              });
          
    }
}



function displayFavResult(htmlDivId,res){
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