const params = new URLSearchParams(document.location.search);
const getId = params.get("getId");

//Fonction pour afficher le numéro de commande
function idDisplay() {
  const id = document.getElementById("orderId");
  id.innerText = getId;
}
idDisplay();
