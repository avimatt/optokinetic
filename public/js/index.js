/**
 * Created by lironhayman on 18/01/2017.
 */

/* For all *critical* elements in the page, go and attach class names
* *critical* is defined as an element that has class article_# when the page is loaded
* At the moment this is pretty hard-coded (we know how many critical elements are in the page)
* TODO: regex, looking for classes that start with article_
* */

var NUM_ARTICLES = 9;

function addClassNamesToChildren() {
    for(var i = 0; i < NUM_ARTICLES; i++) //INDEXED FROM 0
    {
        $( ".article_" + i ).find("*").addClass( "article_" + i );
    }
}

function addOurModal() {
    $(".modal-body").find("*").addClass("our_modal");

}


$(document).ready(function() {
    addClassNamesToChildren();
    addOurModal();
    $(".starts-hidden").hide();
});


