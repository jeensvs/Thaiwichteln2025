// Teilnehmerliste
const participants = ["Jens","Susanne","Claus","Inga","Ole","Caroline","Henrik","Annbritt"];
const fixedGiver = "Jens";
const fixedReceiver = "Susanne";

// Prüfen, ob URL einen Token enthält
const urlParams = new URLSearchParams(window.location.search);
const tokenParam = urlParams.get("token");

if(tokenParam){
  // Teilnehmer-Modus: nur eigene Zuweisung anzeigen
  const tokenMap = JSON.parse(localStorage.getItem("tokenMap"));
  const assignments = JSON.parse(localStorage.getItem("assignments"));
  if(tokenMap && assignments[tokenMap[tokenParam]]){
    document.getElementById("assignment").innerText = `Du beschenkst: ${assignments[tokenMap[tokenParam]]}`;
    document.getElementById("admin").style.display = "none";
  } else {
    document.getElementById("assignment").innerText = "Ungültiger oder abgelaufener Token.";
    document.getElementById("admin").style.display = "none";
  }
} else {
  // Admin-Modus: Zuweisungen erstellen
  document.getElementById("generateBtn").addEventListener("click", ()=>{
    // Zufällige Zuweisung ohne Gegenseitigkeit
    let others = participants.filter(p => p!==fixedGiver && p!==fixedReceiver);
    let shuffled;
    do {
      shuffled = others.slice().sort(()=>Math.random()-0.5);
    } while(shuffled.some((v,i)=>v===others[i]));

    const assignments = {};
    assignments[fixedGiver] = fixedReceiver;
    for(let i=0;i<others.length;i++){
      assignments[others[i]] = shuffled[i];
    }

    // Tokens erzeugen
    const tokenMap = {};
    participants.forEach(p => {
      const token = Math.random().toString(36).substr(2,8);
      tokenMap[token] = p;
    });

    // Speichern für Teilnehmer-Modus
    localStorage.setItem("assignments", JSON.stringify(assignments));
    localStorage.setItem("tokenMap", JSON.stringify(tokenMap));

    // Links anzeigen
    const linksDiv = document.getElementById("links");
    linksDiv.innerHTML = "<h3>Teilnehmer-Links:</h3>";
    for(const [token, giver] of Object.entries(tokenMap)){
      const link = document.createElement("a");
      link.href = `?token=${token}`;
      link.target = "_blank";
      link.innerText = `${giver}`;
      link.style.display = "block";
      linksDiv.appendChild(link);
    }
  });
}
