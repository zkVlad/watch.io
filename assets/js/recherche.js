var items = document.getElementsByName('item');
var selectedItem = document.getElementById('selected-item');
var dropdown = document.getElementById('dropdown');

items.forEach(item => {
  item.addEventListener('change', () => {
    if (item.checked) {
      selectedItem.innerHTML = item.value;
      dropdown.open = false;
    }
  });
});

// Appel API en utilisant des promesses et les saisies de l'utilisateur
const formulaireDeRecherce = document.querySelector('.formulaire-de-recherce');
const listeDesResultats = document.getElementById('resultats-recherche');
const zonePagination = document.getElementById('zone-pagination');
const presentationResultats = document.getElementById('presentation-resultats');
const chargement = document.createElement('div');
var nombreDeResultats = 0;

chargement.classList.add('chargement');

const appelApi = (requete, page) => {
    listeDesResultats.innerHTML = '';
    listeDesResultats.appendChild(chargement);
    zonePagination.innerHTML = '';
    presentationResultats.innerHTML = '';

    return fetch(`${requete}&page=${page}`)
    .then(
        response => response.json()
    ).then(
        data => {
            chargement.remove();
            const filmsRetournes = data.Search;
            filmsRetournes.forEach(film => {
                const itemFilm = document.createElement('li');
                itemFilm.classList.add('item-film');

                const posterFilm = document.createElement('img');
                if(film.Poster === 'N/A'){
                    posterFilm.src = 'https://via.placeholder.com/245x325/22262F/FFFFFF?text=Poster+Introuvable';
                } else {
                    posterFilm.src = film.Poster;
                }
                posterFilm.alt = film.Title;

                const titreFilm = document.createElement('h2');
                titreFilm.textContent = film.Title;

                const anneeFilm = document.createElement('p');
                anneeFilm.textContent = film.Year;

                const typeFilm = document.createElement('span');
                switch (film.Type) {
                    case 'movie':
                        typeFilm.textContent = ' (Film)';
                        break;
                    case 'series':
                        typeFilm.textContent = ' (Série)';
                        break;
                    case 'game':
                        typeFilm.textContent = ' (Jeu)';
                        break;
                    default:
                        typeFilm.textContent = ' (Inconnu)';
                }

                itemFilm.appendChild(posterFilm);
                itemFilm.appendChild(titreFilm);
                itemFilm.appendChild(anneeFilm);
                anneeFilm.appendChild(typeFilm);

                listeDesResultats.appendChild(itemFilm);
            });

            nombreDeResultats = parseInt(data.totalResults);

            const headingPresentationResultats = document.createElement('h2');
            headingPresentationResultats.textContent = 'Resultats de votre recherche :';

            const nombrePresentationResultats = document.createElement('p');
            nombrePresentationResultats.classList.add('details-presentation-resultats');
            nombrePresentationResultats.textContent = nombreDeResultats + ' résultats retrouvés.';

            presentationResultats.appendChild(headingPresentationResultats);
            presentationResultats.appendChild(nombrePresentationResultats);

            if(nombreDeResultats > 10) {
                let pageCourante = page;
                const totalPages = Math.ceil(nombreDeResultats / 10);
                const nombrePageAffichees = 5;
                const pagination = document.createElement('div');
                pagination.id = 'pagination';
        
                const boutonPrecedent = document.createElement('button');
                boutonPrecedent.id = 'bouton-precedent';
                boutonPrecedent.textContent = 'Précédent';
                if (page == 1) {
                    boutonPrecedent.classList.add('bouton', 'bouton--ghost');
                } else {
                    boutonPrecedent.classList.add('bouton', 'bouton--behind');
                }
        
                const goTo = document.createElement('input');
                goTo.id = 'numero-page';
                goTo.setAttribute('type', 'number');
                goTo.classList.add('go-to');

                const indicationPages = document.createElement('div');
                indicationPages.textContent = `sur ${totalPages}`;
                indicationPages.classList.add('indication-pages');
        
                const boutonSuivant = document.createElement('button');
                boutonSuivant.id = 'bouton-suivant';
                boutonSuivant.textContent = "Suivant";
                if (page == totalPages) {
                    boutonSuivant.classList.add('bouton', 'bouton--ghost');
                } else {
                    boutonSuivant.classList.add('bouton', 'bouton--behind');
                }
        
                const numerosPages = document.createElement('div');
                numerosPages.id = 'numeros-pages';
        
                pagination.appendChild(boutonPrecedent);
                pagination.appendChild(goTo);
                pagination.appendChild(indicationPages);
                pagination.appendChild(boutonSuivant);
                pagination.appendChild(numerosPages);
        
                zonePagination.appendChild(pagination);
        
                // Nous devons ensuite incorporer la logique de la pagination
                // Si la page courante est 1, alors le bouton precedent n'a pas d'effet, sinon il recule la page courante
                boutonPrecedent.addEventListener("click", () => {
                    if (pageCourante > 1) {
                        pageCourante--;
                        // Nous mettons à jour le nombre dans l'input
                        goTo.value = pageCourante;
                        appelApi(requete, pageCourante);
                    }
                });
        
                // Si la page courante est inférieure au nombre total de pages et n'est donc pas la dernière, alors le bouton augmente la page courante
                boutonSuivant.addEventListener("click", () => {
                if (pageCourante < totalPages) {
                    pageCourante++;
                    // Nous mettons à jour le nombre dans l'input
                    goTo.value = pageCourante;                    
                    appelApi(requete, pageCourante);
                }
                });
        
                //  À chaque frappe dans l'input aller à, nous vérifions si nous avons appuyé sur Entrée, la page courante devient alors la valeur de l'input
                goTo.addEventListener("keyup", (event) => {
                if (event.key === "Enter") {
                    pageCourante = parseInt(goTo.value);
                    // Si la page résultante n'est pas un nombre ou alors est inférieure à 1, nous lui affectons 1
                    if (isNaN(pageCourante) || pageCourante < 1) {
                        pageCourante = 1;
                    }
                    // Si la page résultante est supérieure au nombre total de pages, alors nous lui affectons la page maximale
                    else if (pageCourante > totalPages) {
                        pageCourante = totalPages;
                    }
                    // Nous mettons à jour le nombre dans l'input
                    goTo.value = pageCourante;
                    appelApi(requete, pageCourante);
                }
                });
    
                goTo.value = pageCourante;
            }
        }
    ).catch(error => {
        console.error(error);
    });
};

formulaireDeRecherce.addEventListener('submit', (e) => {
    e.preventDefault();

    const champTitreFilm = formulaireDeRecherce.querySelector('input[name="titre"]');
    const champAnneeFilm = formulaireDeRecherce.querySelector('input[name="annee"]');
    const champTypeFilm = formulaireDeRecherce.querySelector('input[name="item"]:checked');

    const valeurTitreFilm = champTitreFilm.value;
    const valeurAnneeFilm = champAnneeFilm.value;

    let requete = `http://www.omdbapi.com/?apikey=4ee808d0&s=${valeurTitreFilm}&y=${valeurAnneeFilm}`;

    if(champTypeFilm) {
        const valeurTypeFilm  = champTypeFilm.dataset.requete;
        requete = requete + `&type=${valeurTypeFilm}`;
    }

    appelApi(requete, 1);

});