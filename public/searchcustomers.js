function searchCustomersByFirstName() { 
    var first_name_search_string  = document.getElementById('first_name_search_string').value
    window.location = '/customers/firstnamesearch/' + encodeURI(first_name_search_string)
}

function searchCustomersByLastName() { 
    var last_name_search_string  = document.getElementById('last_name_search_string').value
    window.location = '/customers/lastnamesearch/' + encodeURI(last_name_search_string)
}