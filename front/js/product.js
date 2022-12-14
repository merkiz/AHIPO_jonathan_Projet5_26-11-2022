//Recuperation de l'id des produits
const params = new URLSearchParams(document.location.search);
console.log({ params });

const id = params.get("id");
console.log({ id });

//Appel de l'API
fetch(`http://localhost:3000/api/products/${id}`)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function (jsonKanap) {
    console.log({ jsonKanap });
    displayKanap(jsonKanap);
    cartProduct(jsonKanap);
  })
  .catch(function (err) {
    console.log(err);
  });

// Recuperation du choix de la couleur du DOM
const colorsId = document.getElementById("colors");
console.log({ colorsId });

// Recuperation du choix de la quantité du DOM
const productQuantity = document.getElementById("quantity");
console.log({ productQuantity });

// Fonction pour afficher les éléments des canapés sur la page produit
function displayKanap(jsonKanap) {
  // Recuperation des class et Id dans le DOM qui correspond
  const imgClass = document.querySelector(".item__img");
  const titleId = document.getElementById("title");
  const priceId = document.getElementById("price");
  const descriptionId = document.getElementById("description");

  // Creation des elements qui ne pas présents dans le DOM
  const imageElement = document.createElement("img");

  //Affichage des données contenus dans l'API en les inserants
  imageElement.src = jsonKanap.imageUrl;
  imageElement.alt = jsonKanap.altTxt;
  titleId.innerText = jsonKanap.name;
  priceId.innerText = jsonKanap.price;
  descriptionId.innerText = jsonKanap.description;

  // Acrocher l'image crée à la class correspond
  imgClass.appendChild(imageElement);
  console.log({ imgClass });

  //Recuperation des couleurs pour les mettre dans les options
  for (color of jsonKanap.colors) {
    const optionElement = document.createElement("option");
    optionElement.innerText = color;
    optionElement.value = color;
    colorsId.appendChild(optionElement);
  }
}
//Fonction qui ecoute le bouton ajouter au panier
function cartProduct(jsonKanap) {
  const button = document.getElementById("addToCart");

  //Ecoute de l'evenement click sur le bouton ajouter au panier
  button.addEventListener("click", (event) => {
    event.preventDefault();

    //Creation de l'objet panier
    const productKanap = {
      id: jsonKanap._id,
      color: colorsId.value,
      quantity: parseInt(productQuantity.value),
    };

    if (productKanap.color == false) {
      alert("Veuillez choisir une couleur");
    } else if (productKanap.quantity <= 0 || productKanap.quantity > 100) {
      alert("Veuillez choisir une quantité valide");
    } else {
      alert("Votre article a été ajouté au panier");
      addCart(productKanap);
    }
  });

  //Fonction  pour recuperer les produits du Local Storage
  function getBasket() {
    let productLocalStorage = localStorage.getItem("product");

    //Si il n'y a pas de produits dans le LocaL Storage
    if (productLocalStorage == null) {
      //Retourner un tableau vide
      return [];
    } else {
      //Retourner la chaine de caractere de caractere en un tableau
      return JSON.parse(productLocalStorage);
    }
  }
  //Fonction ajouter les produits dans le panier

  function addCart(productKanap) {
    //Recuperation des produits du Local Storage
    let productLocalStorage = getBasket();
    //Recherche si un element dans mon tableau est identique
    const foundProduct = productLocalStorage.find(
      (product) =>
        product.id == productKanap.id && product.color == productKanap.color
    );
    //Si il y a déjà des produits dans le panier avec le même id et la couleur, les additionne
    if (foundProduct != undefined) {
      foundProduct.quantity += parseInt(productKanap.quantity);
    } else {
      //Si il n'y a pas encore de produits dans le lS push le produit
      productLocalStorage.push(productKanap);
    }
    localStorage.setItem("product", JSON.stringify(productLocalStorage));
  }
}
