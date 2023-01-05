//Appel à l'API
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((data) => addProducts(data))
  .catch((error) => console.log({ error }));
//fonction affichage des produits sur la page d'accueil
function addProducts(data) {
  console.log(data);

  data.forEach((product) => {
    const { _id, imageUrl, altTxt, name, description } = product;
    const anchor = makeAnchor(_id);
    const article = makeArticle();
    const image = makeImage(imageUrl, altTxt);
    const h3 = makeH3(name);
    const p = makeParagraph(description);

    appendElementsToArticle(article, image, h3, p);
    appendArticleToAnchor(anchor, article);
  });
}
//Fonction pour ajouter les élements dans la fiche article
function appendElementsToArticle(article, image, h3, p) {
  article.appendChild(image);
  article.appendChild(h3);
  article.appendChild(p);
}
// Création des liens qui vont contenir les articles
function makeAnchor(id) {
  const anchor = document.createElement("a");
  //Lien id des elements pour l'envoi à la page produit
  anchor.href = "./product.html?id=" + id;
  return anchor;
}
// Récupération de l'élément du DOM qui va contenir tous les produits
function appendArticleToAnchor(anchor, article) {
  const items = document.querySelector("#items");
  items.appendChild(anchor);
  anchor.appendChild(article);
}
// Création des balises qui vont contenir les fiches canapés
function makeArticle() {
  const article = document.createElement("article");
  return article;
}
//Création de l'element image
function makeImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  return image;
}
//Création de l'element titre
function makeH3(name) {
  const h3 = document.createElement("h3");
  h3.textContent = name;
  h3.classList.add("productName");
  return h3;
}
//Création de l'element description
function makeParagraph(description) {
  const p = document.createElement("p");
  p.textContent = description;
  p.classList.add("productDescription");
  return p;
}
