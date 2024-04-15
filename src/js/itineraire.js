window.onload = function(){
    getStations()
}

const MAX_STATIONS = 2000
const map = L.map('map').setView([48.86337661743164, 2.4466350078582764], 11);
var stations = []
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

/**
 * compare two stations (alphabetically by name)
 * @param a station a
 * @param b station b
 * @returns {number}
 */
function compare(a, b){
    if(a.fields.nom_gares < b.fields.nom_gares) return -1
    else if(a.fields.nom_gares > b.fields.nom_gares) return 1
    return 0
}

/**
 * get all the stations to display them in the inputs to choose the departure and arrival station
 */
function getStations(){
    loader.style.display = 'block'
    $.ajax({
        method: "GET",
        url: "https://opendata.hauts-de-seine.fr/api/records/1.0/search/?dataset=gares-et-stations-du-reseau-ferre-dile-de-france-par-ligne&q=&rows=" + MAX_STATIONS + "&facet=id_ref_lda&facet=idrefliga",
        async: true,
        success: function(data) {
            console.log(data)
            for (const element of data.records) {
                stations.push(element)
            }
            stations.sort(compare)
            for (let i = 0; i < stations.length - 1; i++) {
                if(compare(stations[i], stations[i+1]) == 0){
                    delete stations[i]
                }
            }
            stations.forEach((item, index) => {
                $('#list-gare-depart').append("<option value='" + stations[index].fields.nom_gares + "'>")
                $('#list-gare-arrivee').append("<option value='" + stations[index].fields.nom_gares + "'>")
            })
            loader.style.display = 'none'
        },
        error: function(){
            alert('0 station found')
        }
    })
}