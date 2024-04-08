const map = L.map('map').setView([48.86337661743164, 2.4466350078582764], 11);
var loader = document.querySelector('.loader')

var arret = L.icon({
    iconUrl: 'img/arret3.png',
    iconSize:     [10, 10], // size of the icon
    iconAnchor:   [5, 5], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let rotation = 0

$('#retour').click(function () {
    $('#itineraire').show()
    $('#chemin').hide()
    $('.loader').hide()
    document.getElementById("scrollable").innerHTML = ''
})

/**
 * swipe button, swap the values of the two inputs and rotate the button
 */
$('#swipe').click(function(){
    tmp = $('#departChoix').val()
    $('#departChoix').val($('#arriveeChoix').val())
    $('#arriveeChoix').val(tmp)
    rotation += 180;
    $(this).css('transform', 'rotateY(' + rotation + 'deg)');
})

$(document).click(function (event) {
    if ($(event.target).closest("#chemin, header, footer, #itineraire, #back").length === 0) {
        $('#map').css('z-index', '1');
        $('header, footer, #back').css('z-index', '2');
        $('#back').show()
    }
});

$('#back').click(function (){
    $('#map').css('z-index', '-1');
    $('#back').hide()
})

$('#valider').click(function () {
    $('#itineraire').hide()
    $('#chemin').show()
})