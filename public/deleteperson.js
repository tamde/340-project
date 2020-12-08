//function called to manipulate url when deleting a customer
function deletePerson(id){
    $.ajax({
        url: '/customers/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};