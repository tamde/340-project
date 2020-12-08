// function to help delete games
function deleteGame(id){
    $.ajax({
        url: '/games/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

