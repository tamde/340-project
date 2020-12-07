function searchGameByName() {
    //get the first name 
    console.log("hello there");
    var gameNameSearch  = document.getElementById('gameNameSearch').value;
    // console.log(gameNameSearch);
    //construct the URL and redirect to it
    window.location = '/games/search/' + encodeURI(gameNameSearch)
}
