window.onload = function(){
    getStations()
}

const MAX_STATIONS = 2000
const map = L.map('map').setView([48.86337661743164, 2.4466350078582764], 11);
const PROXY_IP = 'localhost'
const PROXY_PORT = '3000'

var stations = []
var polylines = []
var markers = []

var arret = L.icon({
    iconUrl: '../../assets/img/arret3.png',
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
    clearMap()
    document.getElementById("scrollable").innerHTML = ''
})

/**
 * swipe button, swap the values of the two inputs and rotate the button
 */
$('#swipe').click(function(){
    let tmp = $('#departChoix').val()
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
    let start = $('#departChoix').val()
    let end = $('#arriveeChoix').val()
    searchJourney(start, end)
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
        },
        error: function(){
            alert('0 station found')
        }
    })
}

/**
 * Search a journey between two points
 * @param start start point
 * @param end end point
 */
function searchJourney(start, end){

    var requestData = {
        "origin": {
            "address": start
        },
        "destination": {
            "address": end
        },
        "travelMode": "TRANSIT",
        "computeAlternativeRoutes": false,
        "transitPreferences": {
            "routingPreference": "LESS_WALKING",
            "allowedTravelModes": ["BUS", "SUBWAY", "TRAIN", "LIGHT_RAIL", "RAIL"]
        }
    };

    $.ajax({
        url: 'http://' + PROXY_IP + ':' + PROXY_PORT + '/computeRoutes',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function(data) {
            console.log(data);

            var route = 0
            var couleur = '#FFF'
            var nomLigne, mode, libelle
            var noms = []
            for (let i = 0; i < data.routes[route].legs[route].steps.length; i++) {
                if (data.routes[route].legs[route].steps[i].transitDetails) {
                    couleur = data.routes[route].legs[route].steps[i].transitDetails.transitLine.color
                    nomLigne = data.routes[route].legs[route].steps[i].transitDetails.transitLine.name
                    mode = data.routes[route].legs[route].steps[i].transitDetails.transitLine.vehicle.name.text
                    if(mode == "Train" && data.routes[route].legs[route].steps[i].transitDetails.transitLine.agencies[0].name == "RER"){
                        mode = "RER"
                    }
                    if(mode == "Tramway"){
                        nomLigne = nomLigne.charAt(1)
                    }
                    if(mode == "Métro"){ //remove accent
                        mode = "Metro"
                    }
                    libelle = nomLigne
                    noms = placerArrets(data, route, i)

                    if(mode != "Bus"){
                        afficherLigne(mode.toUpperCase(), nomLigne, couleur, noms)
                    }
                    // for the front div
                    remplir(noms[0], mode, noms[1], libelle, couleur)
                }
            }
        },
        error: function(xhr, status, error) {
            alert('Error while searching journey')
            console.error(status, error);
        }
    });
}

/**
 * Get the line
 * @param type type of the line (RER, TRAIN...)
 * @param ligne the line (C, N...)
 */
function afficherLigne(type, ligne, couleur, noms){
    let cpt=0;
    let base = 0;
    do{
        $.ajax({
            method: 'GET',
            url: "https://opendata.hauts-de-seine.fr/api/records/1.0/search/?dataset=traces-du-reseau-de-transport-ferre-dile-de-france&q=&facet=mode&facet=indice_lig&refine.mode="+ type.toUpperCase().trim() + "&refine.indice_lig=" + ligne.toUpperCase().trim() + "&rows=100&start=" + base*100,
            success : function(data){
                cpt = data.parameters.rows;
                tracerLigne(data, couleur, noms);
            },
        });
        ++ base;
    }while(cpt!==0);
}

/**
 * Draw the line on the map
 * @param data the JSON data from the API
 */
function tracerLigne(data, couleur, noms){
    var path;
    for(let i=0; i<data.records.length;++i){
        var tab=[];
        for(let j=0; j<data.records[i].fields.geo_shape.coordinates.length;++j){
            tab.push(data.records[i].fields.geo_shape.coordinates[j].reverse());
        }
        path = L.polyline(tab,{color: couleur, weight: 7}).addTo(map);
        polylines.push(path)
    }
}

/**
 * Place the stops on the map and draw the bus line
 * @param data the JSON data from the API
 * @param route the route we are looking at
 * @param i the step we are looking at
 * @param couleur the color of the line (if it's a bus)
 */
function placerArrets(data, route, i, couleur){
    nbArrets = data.routes[route].legs[route].steps[i].transitDetails.stopCount
    var departLat = data.routes[route].legs[route].steps[i].transitDetails.stopDetails.departureStop.location.latLng.latitude
    var departLon = data.routes[route].legs[route].steps[i].transitDetails.stopDetails.departureStop.location.latLng.longitude
    var arriveeLat = data.routes[route].legs[route].steps[i].transitDetails.stopDetails.arrivalStop.location.latLng.latitude
    var arriveeLon = data.routes[route].legs[route].steps[i].transitDetails.stopDetails.arrivalStop.location.latLng.longitude
    var departNom = data.routes[route].legs[route].steps[i].transitDetails.stopDetails.departureStop.name
    var arriveeNom = data.routes[route].legs[route].steps[i].transitDetails.stopDetails.arrivalStop.name
    placerPoint(departLat, departLon, departNom)
    placerPoint(arriveeLat, arriveeLon, arriveeNom)
    if(data.routes[route].legs[route].steps[i].transitDetails.transitLine.vehicle.name.text == "Bus"){
        couleur = data.routes[route].legs[route].steps[i].transitDetails.transitLine.color
        var bus = []
        bus.push([departLat, departLon])
        bus.push([arriveeLat, arriveeLon])
        var polyline = L.polyline(bus,{color: couleur, weight: 7}).addTo(map);
        polylines.push(polyline)
    }
    var noms = []
    noms.push(departNom)
    noms.push(arriveeNom)
    noms.push(departLat)
    noms.push(departLon)
    noms.push(arriveeLat)
    noms.push(arriveeLon)
    return noms
}

/**
 * Mark a point on the map
 * @param lat latitude of the point
 * @param lon longitude of the point
 * @param nom name of the point
 */
function placerPoint(lat, lon, nom){
    marker = L.marker([lat, lon], {icon: arret})
    markers.push(marker)
    marker.bindPopup('<b>' + nom + '</b>')
    meteo(marker)
}

/**
 * Get the weather of a point
 * @param marker the marker we want the weather of
 */
function meteo (marker){
    var coord = marker.getLatLng()
    $.ajax({
        method: "GET",
        async: false,
        url: 'http://' + PROXY_IP + ':' + PROXY_PORT + `/weather?lat=${coord.lat}&lon=${coord.lng}`,
        success: function(result){
            if(!marker.getPopup().getContent().includes("Température")){
                JSON.stringify(result)
                tempStation = Math.round(result.main.temp - 275) //merci Eyléa
                var content = marker.getPopup().getContent()
                marker.bindPopup(content + '<br>Température : ' + tempStation + '°C').addTo(map)
            }
        }
    })
}

/**
 * Fill the div with the informations of the journey (departure, line, arrival)
 * @param gare_depart explicite
 * @param mode type of the line (RER for RER C)
 * @param gare_arrivee explicite
 * @param libelle name of the line (C for RER C)
 * @param couleur color of the line
 * @param temps not implemented yet
 * @param nb_arrets not implemented yet
 */
function remplir(gare_depart, mode, gare_arrivee, libelle, couleur,temps, nb_arrets,) {
    document.getElementById("scrollable").innerHTML += `    \
    <div class="wrapper"> \
        <div class="one"> \
            <div class="rectangle" style="background-color: ${couleur}"><div class="rond1"></div><div class="rond2"></div></div> \
        </div> \
        <div class="two"> \
            <h3>${gare_depart}</h3> \
        </div> \
        <div class="three"> \
          <h4>${mode} ${libelle} </h4> \
          <!--<p>' + temps + '</p> -->\
          <!--<h4>' + nb_arrets + ' arrêts</h4> \--> \
        </div> \
        <div class="four"> \
          <h3>${gare_arrivee}</h3> \
        </div> \
    </div> \
    `
}

/**
 * Clear the map of all the markers and polylines
 */
function clearMap(){
    markers.forEach(item => {
        map.removeLayer(item)
    })
    polylines.forEach(item => {
        map.removeLayer(item)
    })
}
