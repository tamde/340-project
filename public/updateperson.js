//function called to help update a customer
function updatePerson(id){
    $.ajax({
        url: '/customers/' + id,
        type: 'PUT',
        data: $('#update-customer').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};