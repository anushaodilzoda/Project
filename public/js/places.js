
function searchPlaces(keyWord){
  var location_id=localStorage.getItem("location_id");
    var queryUrl="https://tripadvisor1.p.rapidapi.com/locations/search?location_id="+location_id+"&limit=30&sort=relevance&offset=0&lang=en_US&currency=USD&units=km&query="+keyWord;
    $.ajax(getAjaxSetting(queryUrl)).done(function (response) {
        console.log(response);
        displayPlacesResult("places_result_container",response)
    });
}


function displayPlacesResult(htmlDivId,result){
    result=result.data;
    $("#loading").hide();
    $("#places_result_container").show();
    var domEl=document.getElementById(htmlDivId);
    var el=$(domEl);
    el.empty();
    if(result.length==0){
        el.css("color","#e46509");
        el.text("No matching result");
    }else{
        for(i in result){
            var row=$("<div>").attr("class","row container_div shadow rounded").attr("id",i),
                col1=$("<div>").attr("class","col-md-7 col1"),
                col2=$("<div>").attr("class","row col-md-5 tool_row"),
                col21=$("<div>").attr("class","col-md-3"),
                col22=$("<div>").attr("class","col-md-3"),
                col23=$("<div>").attr("class","col-md-3");

            var div1= $("<h4>").attr("class","result").text(result[i].result_object.name),
                 span=createStarRating(result[i].result_object.rating),
                div2= $("<div>").attr("class","result").text("Address: "+result[i].result_object.address)
                

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


            col1.append(div1,span,div2);
            col21.append(img0,btn0);
            col22.append(img1,btn1);
            col23.append(img2,btn2);
            row.append(col1,col2);
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
    searchPlaces(value);
});
