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
        $("#zipcode_section").show();
        $("#name_section").hide();
    }else if(selected=="Name"){
        $("#name_section").show();
        $("#zipcode_section").hide();
    }else{
        $("#name_section").hide();
        $("#zipcode_section").hide();
    }
});

// Tsolmon

$("#subscribeSubmitBtn").on("click", function(){
    var name="Elisa";
    var obj={
        name: this.name,
        email: "hakuban@yahoo.com",
        fav_food: ["one", "two", "three"]
    };

    localStorage.setItem("member_"+name,JSON.stringify(obj));

  })


