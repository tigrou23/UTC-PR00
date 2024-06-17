# UTC-PR00
___
⚠️ Attention, il est possible qu'aucun trajet ne vous soit proposé si vous utilisez le site dans la nuit (pas de transports a proposé car temps réel) ou alors si votre départ/arrivée ne sont pas explicites.
> N'hésitez pas à créer une issue GitHub si vous rencontrez un problème.
___
<div align="justify">
	Dans ce projet universitaire, nous avons utilisé des APIs pour tracer et indiquer un itinéraire en temps réel entre deux gares d'Île-de-France. Des fonctionnalités supplémentaires ont été ajoutées et décrites ci dessous.
</div>
<br>

Lien vers le site :
- https://pr00.hugopereira.fr

## <center>Table des matières</center>

* [Fonctionnalités détaillées](#chapter1)
  * [Transports disponibles](#section1_1)
  * [Détails du trajet](#section1_2)
  * [Météo disponible sur les stations](#section1_3)

* [Les APIs utilisées](#chapter2)
    * [OpenWeather](#section2_1)
    * [OpenData](#section2_2)
    * [Google](#section2_3)

* [Structure du projet](#chapter3)
    * [Requêtes aux APIs](#section3_1)
    * [Javascript/JQUERY](#section3_2)
    * [CSS](#section3_3)

* [Architecture](#chapter4)
    * [Hébergement du projet](#section4_1)
    * [Nom de domaine](#section4_2)
    * [Certificat SSL](#section4_3)
___
## Fonctionnalités détaillées <a class="anchor" id="chapter1"></a>

### 1. Transports disponibles <a class="anchor" id="section1_1"></a>
Les trajets proposés par le site concernent :
- Train 🚅
- RER 🚈
- Métro 🚇
- Tramway 🚃
- Bus 🚎
<div align="justify">
Afin de simplifier l'identification de chaque ligne, elles sont identifiables (sur la carte et dans le détail des itinéraires) par leurs propres couleurs (ex: jaune pour la ligne 1 du métro).
</div>
<br>

### 2. Détails du trajet <a class="anchor" id="section1_2"></a>
<div align="justify">
Pour chaque trajet proposé, un détail est disponible sur une fenêtre pour apporter plus de précision sur le transport en question ainsi que les gares à emprunter.
</div>
<br>

### 3. Météo disponible sur les stations <a class="anchor" id="section1_3"></a>
<div align="justify">
Les gares principales apparaissent sur la carte (gare de départ et gare d'arrivée pour chaque transport de l'itinéraire). Lorsqu'on clique sur ces dernières, il nous est renseigné le nom ainsi que la météo correspondante.
</div>
<br>

## Les APIs utilisées <a class="anchor" id="chapter2"></a>

### 1. OpenWeather <a class="anchor" id="section2_1"></a>
<div align="justify">
Lien vers le site de l'entreprise : <a href="https://openweathermap.org/api">OpenWeather</a>
<br><br>
Cette API est utilisée pour récupérer la météo pour un point géographique donné. Cela permet d'ajouter la température pour les gares cliquées.
</div>
<br>

### 2. Open Data Hauts de Seine <a class="anchor" id="section2_2"></a>
<div align="justify">
Lien vers le site de l'entreprise : <a href="https://opendata.hauts-de-seine.fr/">Open Data Hauts de Seine</a>
</div>
<br>

API utilisée pour deux choses :
- Récupérer toutes les gares afin de les lister et aider l'utilisateur à trouver sa destination.
- Récupérer les tracés des lignes que l'on cherche. L'API renvoie un tableau de coordonnées qu'on va utiliser pour tracer à l'aide de polylines le parcours de la ligne concernée.

### 3. Google <a class="anchor" id="section2_3"></a>
<br>
Cette API est sans doute la plus importante de notre projet. Elle permet de nous délivrer le chemin entre deux points donnés. Nous trions ensuite les données JSON pour retirer tous trajets à vélo ou à pied. Ce sont avec ces données que nous traçons le trajet et que nous délivrons tous les détails du parcours.
<br>

## Structure du projet <a class="anchor" id="chapter3"></a>

**Toutes nos fonctions JavaScript sont documentées ✅.**

### 1. Requêtes aux APIs <a class="anchor" id="section3_1"></a>
**IMPORTANT** : Les requêtes ne sont pas réalisées par notre JavaScript. Elles sont faites par un PROXY qui a été développé dans un projet annexe : [UTC-PR00-PROXY](https://github.com/tigrou23/UTC-PR00-PROXY).

### 2. Javascript/JQUERY <a class="anchor" id="section3_2"></a>
Ce fichier JavaScript/JQUERY qui gèrent l'aspect algorithmique de notre projet :
- [itineraire.js](./src/js/itineraire.js)

Le fichier *itineraire.js* va  servir à gérer l'aspect événementiel. Par exemple à la validation :

```js
$('#valider').click(function () {
    $('#itineraire').hide()
    $('#chemin').show()
    let index = getIndex($('#departChoix').val())
    let coordonneesDepart = villes[index].fields.geo_point_2d
    index = getIndex($('#arriveeChoix').val())
    let coordonneesArrivee = villes[index].fields.geo_point_2d
    tracerTrajet(coordonneesDepart, coordonneesArrivee)
})
```

### 3. CSS <a class="anchor" id="section3_3"></a>
<div align="justify">
Nous avons utilisé 2 fichiers CSS pour habiller notre site web :<br>
<ul>
	<li>header.css : permet d'habiller le header du site.
	<li>itineraire.css : permet d'habiller la page itinéraire.
</ul>
Les fichiers CSS permettent de rendre notre site web responsive. Il y a une version ordinateur et une version mobile. La version mobile est essentielle pour la cohérence d'un projet abouti. En effet, notre site permet de trouver un itinéraire pour se déplacer. Cette consultation se fait principalement sur un téléphone, lorsque nous n'avons pas accès à notre ordinateur. Il était donc pour nous essentiel de développer cette version réduite pour les smartphones. Concernant le code CSS, nous avons utilisé une méthode de développement web : les variables. 
Le fichier CSS est alors plus lisible ce qui permet de travailler à plusieurs très facilement.
</div>
<br>

## Architecure <a class="anchor" id="chapter4"></a>

### 1. Hébergement du projet <a class="anchor" id="section4_1"></a>
<div align="justify">
Le projet est hébergé en ligne et donc accessible avec un accès internet. 
</div>
<br>

Lien vers le site :
- https://pr00.hugopereira.fr

Une documentation sur le déploiement de l'application est disponible en MarkDown ([Déploiement.md](doc/deploiement-serveur.md)).

### 2. Nom de domaine <a class="anchor" id="section4_2"></a>
<div align="justify">
Un nom de domaine a été acheté sur IONOS pour pouvoir rendre l'accès à notre site plus simple. Il a suffit de paramétrer les champs du DNS pour pouvoir rediriger le flux vers l'adresse IP de notre serveur.
</div>
<br>

### 3. Certificat SSL <a class="anchor" id="section4_3"></a>
<div align="justify">
Nous avons généré un certificat SSL (<i>Transport Layer Security</i>) avec l'outil <i>Certbot</i>. Cet outil est un package que l'on peut télécharger sur Linux en spécifiant le site Apache2 à certifier. De ce fait, notre site est à la fois accessible par le protocole HTTP et HTTPS.
</div>
<br>