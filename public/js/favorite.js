
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
        if(str!=null){
            var arr=str.slice(0, -2).split(";;");
            prepResult(arr);
        }else{
            $("#fav_result_container").html("No favorites to display").css("text-align","center");
        }
       
    });

}

function prepResult(arr){
    for(var i=0; i<arr.length; i++){
        var each=arr[i].split(":");
     console.log("each: "+each);
            var name=each[0].trim();
            var address=each[1].trim();
            var lat=each[2];
            var lon=each[3];
            obj={
                name: name,
                address: address,
                latitude: lat,
                longitude: lon
            }
            console.log(obj);
            displayFavResult("fav_result_container",obj);   
    }
}



function displayFavResult(htmlDivId,result){
    $("#loading").hide();
    $("#fav_result_container").show();
    var domEl=document.getElementById(htmlDivId);
    var el=$(domEl);
    // el.empty();

            var row=$("<div>").attr("class","row container_div shadow rounded"),
                col1=$("<div>").attr("class","col-md-7 col1"),

                col2=$("<div>").attr("class","row col-md-5 tool_row"),
                col23=$("<div>").attr("class","col-md-10");
                

            var div1=$("<a>").attr("class","result result_name").attr("href","#").text(result.name),
                div2= $("<div>").attr("class","result").text("Address: "+result.address);
                
                
            var btn2=$("<a>")
                .attr("class","delete_btn btn btn-full")
                .attr("value",result.name)
                .attr("href","#")
                .text("Delete");


            col1.append(div1,div2);
            col23.append(btn2);
            row.append(col1,col2);
            col2.append(col23);
            el.append(row);
         
}


$("#fav_result_container").on("click",".delete_btn",function(){
    event.preventDefault();
    var deleteObj=$(this).attr("value");
    var userObj=localStorage.getItem("Signed in user: ");
    var arr=[userObj, deleteObj];
    $.ajax("/deleteFav", {
        type: "DELETE",
        data: {data:arr}
    }).then(function() {
        console.log("Deleted from favorites");
    });
location.reload();
});