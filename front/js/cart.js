//Recupere les produits du LocalStorage
let productLocalStorage = JSON.parse(localStorage.getItem("product"));

//Création des variables pour récuperer les elements dans l'api
//Crée des tableaux vides pour la quantité et le prix
var quantityArr = [];
var priceArr = [];

for (let productInStorage of productLocalStorage) {
  //Recupere l'id des produits ajoutés dans le LocalStorage dans la requete fetch
  fetch(`http://localhost:3000/api/products/${productInStorage.id}`)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (productApi) {
      displayProduct(productApi, productInStorage);

      //Appel des fonctions
      displayPriceQtty(productApi, productInStorage);
      deleteProduct();
      changeQuantity();
    })
    .catch(function (err) {
      console.log("erreur 404" + err);
    });
}

//Fonction pour afficher tous les elements dans le panier
function displayProduct(productApi, productInStorage) {
  //Ajoute les éléments du Local Storage et Api dans le DOM
  const productCart = document.getElementById("cart__items");
  productCart.innerHTML += `<article class="cart__item" data-id="${productInStorage.id}" data-color="${productInStorage.color}">
                      <div class="cart__item__img">
                        <img src="${productApi.imageUrl}" alt="${productApi.altTxt}">
                      </div>
                      <div class="cart__item__content">
                        <div class="cart__item__content__description">
                          <h2>${productApi.name}</h2>
                          <p>${productInStorage.color}</p>
                          <p>${productApi.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                          <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInStorage.quantity}">
                          </div>
                          <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                          </div>
                        </div>
                      </div>
                    </article>`;
}

//Fonction pour afficher le prix et la quantité total
function displayPriceQtty(productApi, productInStorage) {
  //Modifie les valeurs du prix et de la quantité
  const valueQuantity = parseInt(productInStorage.quantity);
  //Multiplie le prix par la quantité du produit
  const valuePrice = parseInt(productApi.price) * productInStorage.quantity;

  //Push dans le tableau le prix et la quantité
  quantityArr.push(valueQuantity);
  priceArr.push(valuePrice);

  //Prend l'id du prix et l'id de la quantité dans le DOM
  const price = document.getElementById("totalPrice");
  const quantity = document.getElementById("totalQuantity");

  //Crée une variable pour le prix total et la quantité total qui est à 0
  let totalPrice = 0;
  let totalQuantity = 0;

  //Boucle pour calculer le prix total
  for (let i = 0; i < priceArr.length; i++) {
    //Additionne le prix total et le prix qui se trouve dans le tableau
    totalPrice += priceArr[i];
  }
  //Boucle pour calculer la quantité total
  for (let i = 0; i < quantityArr.length; i++) {
    totalQuantity += quantityArr[i];
  }
  //Ajout du prix total et de la quantité total dans le DOM
  price.innerText = totalPrice;
  quantity.innerText = totalQuantity;
}

//Fonction pour supprimer un élément du panier
function deleteProduct() {
  const buttons = document.querySelectorAll(".deleteItem");
  for (let button of buttons) {
    button.addEventListener("click", () => {
      const kanapId = button.closest(".cart__item").dataset.id;
      const kanapColor = button.closest(".cart__item").dataset.color;
      const foundProduct = productLocalStorage.find(
        (product) => product.id == kanapId && product.color == kanapColor
      );
      productLocalStorage = productLocalStorage.filter(
        (p) => p != foundProduct
      );
      localStorage.setItem("product", JSON.stringify(productLocalStorage));
      location.reload();
    });
  }
}

//Fonction pour modifier la quantité
function changeQuantity() {
  const itemQuantity = document.querySelectorAll(".itemQuantity");

  for (let i = 0; i < itemQuantity.length; i++) {
    itemQuantity[i].addEventListener("change", (event) => {
      console.log(event.target);
      //Recupere les produits du LocalStorage
      let productLocalStorage = JSON.parse(localStorage.getItem("product"));

      const itemTarget = event.target;

      const kanapId = itemTarget.closest(".cart__item").dataset.id;
      const kanapColor = itemTarget.closest(".cart__item").dataset.color;

      //Recupere les produits du localStorage
      const foundProduct = productLocalStorage.find(
        (product) => product.id == kanapId && product.color == kanapColor
      );
      //Modifie la quantité dans productLocalStorage pour ajouter le changement de itemQuantity
      if (itemTarget.value > 0 && itemTarget.value < 100) {
        foundProduct.quantity = parseInt(itemTarget.value);

        localStorage.setItem("product", JSON.stringify(productLocalStorage));
        window.location.reload();
      } else {
        alert("Veuillez ajouter une quantité supérieur à 0 ");
      }
    });
  }
}

/*****************  Formulaire  **********************/

//Recupere le formulaire pour saisir ses coordonnees et confirmer la commande
const form = document.querySelector(".cart__order__form");

//Mise en place des RegExp
const nameRegex = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$");
const addressRegex = new RegExp("^[a-zA-Z0-9àâäéèêëïîôöùûüçs,' -]*$");
const emailRegex = new RegExp(
  "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
);

//Ecoute de l'evenement "change" sur les inputs
form.firstName.addEventListener("change", function () {
  validFirstName(this);
});

form.lastName.addEventListener("change", function () {
  validLastName(this);
});

form.address.addEventListener("change", function () {
  validAddress(this);
});

form.city.addEventListener("change", function () {
  validCity(this);
});

form.email.addEventListener("change", function () {
  validEmail(this);
});

//Fonction qui test les regex dans le formulaire
function validFirstName(inputFirstName) {
  const testFirstName = nameRegex.test(inputFirstName.value);
  const errorMsgFirstName = inputFirstName.nextElementSibling;

  //Affiche un message d'erreur si l'utilisateur renseigne mal ses informations sinon n'affiche rien
  if (!testFirstName) {
    errorMsgFirstName.innerText = "Le format n'est pas valide";
    return false;
  } else {
    errorMsgFirstName.innerText = "";
    return true;
  }
}

//Fonction qui test les regex dans le formulaire
function validLastName(inputLastName) {
  const testLastName = nameRegex.test(inputLastName.value);
  const errorMsgLastName = inputLastName.nextElementSibling;

  if (!testLastName) {
    errorMsgLastName.innerText = "Le format n'est pas valide";
    return false;
  } else {
    errorMsgLastName.innerText = "";
    return true;
  }
}

//Fonction qui test les regex dans le formulaire
function validAddress(inputAddress) {
  const testAddress = addressRegex.test(inputAddress.value);
  const errorMsgAddress = inputAddress.nextElementSibling;

  if (!testAddress) {
    errorMsgAddress.innerText = "L'adresse n'est pas valide";
    return false;
  } else {
    errorMsgAddress.innerText = "";
    return true;
  }
}

//Fonction qui test les regex dans le formulaire
function validCity(inputCity) {
  const testCity = nameRegex.test(inputCity.value);
  const errorMsgCity = inputCity.nextElementSibling;

  if (!testCity) {
    errorMsgCity.innerText = "Le format n'est pas valide";
    return false;
  } else {
    errorMsgCity.innerText = "";
    return true;
  }
}

//Fonction qui test les regex dans le formulaire
function validEmail(inputEmail) {
  const testEmail = emailRegex.test(inputEmail.value);
  const errorMsgEmail = inputEmail.nextElementSibling;

  if (!testEmail) {
    errorMsgEmail.innerText = "L'email n'est pas valide";
    return false;
  } else {
    errorMsgEmail.innerText = "";
    return true;
  }
}

const buttonOrder = document.querySelector("#order");

//Ecoute du click sur le bouton order pour envoyer ou non le formulaire
buttonOrder.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    validEmail(form.email) &&
    validFirstName(form.firstName) &&
    validLastName(form.lastName) &&
    validCity(form.city) &&
    validAddress(form.address) &&
    productLocalStorage.length === 0
  ) {
    alert("Votre panier est vide");
  } else if (
    validEmail(form.email) &&
    validFirstName(form.firstName) &&
    validLastName(form.lastName) &&
    validCity(form.city) &&
    validAddress(form.address)
  ) {
    postOrder();
  } else {
    alert("Commande non envoyé");
  }

  //Fonction pour l'envoi de la commande
  function postOrder() {
    //Prends les inputs pour la creation de l'objet contact
    const inputFirstName = document.querySelector("#firstName");
    const inputlastName = document.querySelector("#lastName");
    const inputAddress = document.querySelector("#address");
    const inputCity = document.querySelector("#city");
    const inputEmail = document.querySelector("#email");

    //Création de l'objet contact
    const contact = {
      firstName: inputFirstName.value,
      lastName: inputlastName.value,
      address: inputAddress.value,
      city: inputCity.value,
      email: inputEmail.value,
    };

    //Creation d'un tableau vide pour ajouter les id des produits
    const products = [];

    for (let i = 0; i < productLocalStorage.length; i++) {
      products.push(productLocalStorage[i].id);
      console.log(productLocalStorage[i].id);
    }
    //Declaration de l'objet data qui contient le formulaire de contact et l'id des produits dans le panier
    const data = {
      contact,
      products,
    };
    console.log(data);

    //Requete pour envoyer à l'API
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Probleme d'envoi du formulaire");
        } else {
          alert("Commande bien effectuée");
          return response.json();
        }
      })
      .then((response) => {
        window.location.href = `../html/confirmation.html?getId=${response.orderId}`;
        localStorage.clear();
      })
      .catch((err) => {
        console.log("erreur requete" + err);
      });
  }
});
