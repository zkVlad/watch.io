/* Librairies */
import Swal from 'sweetalert2';

var films = [
    {    name: "Deadpool",      years: 2016,    authors : "Tim Miller" },
    {    name: "Spiderman",     years: 2002,    authors : "Sam Raimi" },
    {    name: "Scream",        years: 1996,    authors : "Wes Craven" },
    {    name: "It: chapter 1", years: 2019,    authors : "Andy Muschietti" }
];

const tableContent = document.getElementById("table-content");

const createRow = (obj) => {
    const row = document.createElement("tr");
    const objKeys = Object.keys(obj);
    objKeys.map((key) => {
      const cell = document.createElement("td");
      cell.setAttribute("data-attr", key);
      cell.innerHTML = obj[key];
      row.appendChild(cell);
    });
    const caseBoutonSupprimer = document.createElement("td");
    const boutonSupprimer = document.createElement("button");

    boutonSupprimer.textContent = "Supprimer";
    boutonSupprimer.classList.add('bouton', 'bouton--ghost', 'bouton__supprimer');

    caseBoutonSupprimer.appendChild(boutonSupprimer);
    row.appendChild(caseBoutonSupprimer);

    return row;
  };

  const getTableContent = (data) => {
    data.map((obj, index) => {
      const row = createRow(obj);
      row.dataset.id = index;
      tableContent.appendChild(row);
    });

        /* Fonction de suppression */
const boutonsSupprimer = [...document.querySelectorAll(".bouton__supprimer")];
boutonsSupprimer.map((bouton) => {
    bouton.addEventListener("click", supprimmerRang);
});
  };

const retournerMajuscules = str => str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

const supprimmerRang = (e) => {
    Swal.fire({
        showCloseButton: true,
        html: `
            <h2>Souhaitez-vous vraiment supprimer "${e.target.parentNode.parentNode.firstChild.textContent}"</h2>
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirmer la suppression',
        cancelButtonText: 'Annuler'
    }).then((result) => {
        if(result.isConfirmed) {
            films.splice(e.target.parentNode.parentNode.dataset.id, 1);
            tableContent.innerHTML = '';
            getTableContent(films);
            Swal.fire({
                position: 'bottom-end',
                icon: 'success',
                html: 'Le film ' + e.target.parentNode.parentNode.firstChild.textContent + ' a bien été supprimé',
                showConfirmButton: false,
                backdrop: 'transparent',
                timer: 3000,
                timerProgressBar: true
            });
        }
    });
};

// TODO


/* Fonction de tri */
const tableButtons = document.querySelectorAll("th button");

const sortData = (data, param, direction = "asc") => {
    tableContent.innerHTML = '';
    const sortedData =
      direction == "asc"
        ? [...data].sort(function (a, b) {
            if (a[param] < b[param]) {
              return -1;
            }
            if (a[param] > b[param]) {
              return 1;
            }
            return 0;
          })
        : [...data].sort(function (a, b) {
            if (b[param] < a[param]) {
              return -1;
            }
            if (b[param] > a[param]) {
              return 1;
            }
            return 0;
          });
    getTableContent(sortedData);
  };

const resetButtons = (event) => {
    [...tableButtons].map((button) => {
        if (button !== event.target) {
            button.removeAttribute("data-dir");
        }
    });
};

window.addEventListener("load", () => {
    getTableContent(films);
    [...tableButtons].map((button) => {
      button.addEventListener("click", (e) => {
        console.log(e);
          resetButtons(e);
        if (e.target.getAttribute("data-dir") == "desc") {
          sortData(films, e.target.id, "desc");
          e.target.setAttribute("data-dir", "asc");
        } else {
          sortData(films, e.target.id, "asc");
          e.target.setAttribute("data-dir", "desc");
        }
      });
    });
  });

  /* Rajout films */
  const boutonAjoutFilm = document.getElementById("bouton-ajout-film");
  boutonAjoutFilm.addEventListener("click", () => {
    Swal.fire({
        showCloseButton: true,
        html: `
            <h2>Ajouter un film à votre liste</h2>
            <input type="text" id="champ-titre-film" class="swal2-input" placeholder="Titre du film">
            <input type="number" id="champ-annee-film" class="swal2-input" placeholder="Année de sortie">
            <input type="text" id="champ-auteur-film" class="swal2-input" placeholder="Nom de l'auteur">
        `,
        confirmButtonText: 'Ajouter le film',
        focusConfirm: false,
        preConfirm: () => {
          const champTitreFilm = retournerMajuscules(Swal.getPopup().querySelector('#champ-titre-film').value);
          const champAnneeFilm = retournerMajuscules(Swal.getPopup().querySelector('#champ-annee-film').value);
          const champAuteurFilm = retournerMajuscules(Swal.getPopup().querySelector('#champ-auteur-film').value);
          const anneeCourante = new Date().getFullYear();
          let erreursSaisie = [];

          if (champTitreFilm.length < 2) {
            erreursSaisie.push('Le nom du film doit comporter au moins 2 caractères.');
          }

          if (!/^\d{4}$/.test(champAnneeFilm) || champAnneeFilm < 1900 || champAnneeFilm > anneeCourante) {
            erreursSaisie.push(`Indiquez une année dans un format à 4 chiffres et comprise en 1900 et ${anneeCourante}.`);
          }

          if (champAuteurFilm.length < 5) {
            erreursSaisie.push('Le nom de l\'auteur doit comporter au moins 5 caractères.');
          }

          if (erreursSaisie.length > 0) {
            let erreursFormatees = erreursSaisie.map(erreur => `<li>${erreur}</li>`).join('');
            Swal.showValidationMessage(`
                <p>Votre saisie est incorrecte :</p>
                <ul>${erreursFormatees}</ul>
            `)
            setTimeout(() => {
                Swal.resetValidationMessage();
            }, 6000);
          }
          return { champTitreFilm: champTitreFilm, champAnneeFilm: champAnneeFilm, champAuteurFilm: champAuteurFilm }
        }
      }).then((result) => {
            let nouveauFilm = [{
                name: result.value.champTitreFilm,
                years: result.value.champAnneeFilm,
                authors : result.value.champAuteurFilm
            }];
            tableContent.innerHTML = '';
            films = films.concat(nouveauFilm);
            getTableContent(films);
            Swal.fire({
                position: 'bottom-end',
                icon: 'success',
                html: 'Le film ' + nouveauFilm[0].name + ' a bien été ajouté à votre liste',
                showConfirmButton: false,
                backdrop: 'transparent',
                timer: 3000,
                timerProgressBar: true
            }
        )
      })
  });

//   Faire en sorte que les options du select déclenchent le tri existant
const champSelectTri = document.querySelector("#choix-filtres");

champSelectTri.addEventListener('change', function(){
    const optionSelectionnee = this.options[this.selectedIndex];
    const idBoutonTri = optionSelectionnee.dataset.boutonVise;
    const boutonTri = document.querySelector(`#${idBoutonTri}`);

    [...tableButtons].map((button) => {
        if (button !== boutonTri) {
            button.removeAttribute("data-dir");
        }
    });

    sortData(films, optionSelectionnee.dataset.boutonVise, optionSelectionnee.dataset.methodeTri);
    boutonTri.setAttribute("data-dir", optionSelectionnee.dataset.methodeTri === "asc" ? "desc" : "asc");
});
