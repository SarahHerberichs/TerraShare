document.addEventListener("DOMContentLoaded", function () {
  // Récupération de la valeur de userLoggedIn depuis l'attribut data-*
  var userLoggedInElement = document.getElementById("userLoggedIn");
  var userLoggedIn = userLoggedInElement.dataset.loggedIn === "true";

  // Si l'utilisateur n'est pas connecté, afficher le message d'erreur
  if (!userLoggedIn) {
    var errorMessageDiv = document.getElementById("errorMessage");
    errorMessageDiv.style.display = "block";
    //Si l'utilisateur est loggé
  } else {
    var departmentsSelect = document.getElementById("departments");
    var citySearchInput = document.getElementById("city-search");
    var citiesList = document.getElementById("citiesList");

    function updateCitiesList(departmentNumber, searchQuery = "") {
      //Création d'une requete AJAX asynchrone
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        //Le statut est à 4 lorsquela requête est terminée
        if (xhr.readyState === 4) {
          //Le status est 200 si la requête a abouti
          if (xhr.status === 200) {
            //Analyse de la réponse JSON
            var citiesData = JSON.parse(xhr.responseText);
            citiesList.innerHTML = "";
            //Pour chaque city crée une div qui contiendra une span avec le city.name
            citiesData.forEach(function (city) {
              var cityContainer = document.createElement("div");
              cityContainer.className = "city-item";

              var cityName = document.createElement("span");

              cityName.textContent = city.name + "-" + city.zipcode;

              cityContainer.appendChild(cityName);
              //Redirection au click sur une ville vers l'url pour créer une Ad
              cityContainer.addEventListener("click", function () {
                window.location.href = "/create-ad/" + city.id;
              });
              //Injection dans la div vide initiale des villes
              citiesList.appendChild(cityContainer);
            });
          } else {
            alert("Erreur de requête AJAX : " + xhr.status);
          }
        }
      };

      var url = "/get-cities/" + departmentNumber;
      //vérifie que le parametre passé à la fonction n'est pas vide, si pas vide l'ajoute à l'url en format encodé pour transmettre la chaine de recherche au server
      if (searchQuery !== "") {
        url += "?search=" + encodeURIComponent(searchQuery);
      }
      ///ouverture et envoi de la requete
      xhr.open("GET", url, true);
      xhr.send();
    }

    departmentsSelect.addEventListener("change", function () {
      var selectedDepartmentNumber = departmentsSelect.value;
      updateCitiesList(selectedDepartmentNumber, citySearchInput.value);
    });

    citySearchInput.addEventListener("input", function () {
      var selectedDepartmentNumber = departmentsSelect.value;
      updateCitiesList(selectedDepartmentNumber, citySearchInput.value);
    });
  }
});
