const participants = ["Jens","Susanne","Claus","Inga","Ole","Caroline","Henrik","Annbritt"];
const fixedGiver = "Jens";
const fixedReceiver = "Susanne";

// Prüfen, ob URL einen Token enthält
const urlParams = new URLSearchParams(window.location.search);
const tokenParam = urlParams.get("token");

if(tokenParam){
  // Teilnehmer-Modus
  const tokenMap = JSON.parse(localStorage.getItem("tokenMap"));
  const assignments = JSON.parse(localStorage.getItem("assignments"));
  const giver = tokenMap[tokenParam];
  const receiver = assignments[giver];

  document.getElementById("admin").style.display = "none";
  const drawArea = document.getElementById("drawArea");
  const drawBtn = document.getElementById("drawBtn");

  drawBtn.addEventListener("click", ()=>{
    drawBtn.disabled = true;

    let names = [...participants];
    let currentIndex = 0;
    let speed = 50; // Startgeschwindigkeit in ms
    let slowing = false;
    let lastUpdate = performance.now();

    function animate(now){
      if(now - lastUpdate >= speed){
        drawArea.innerText = names[currentIndex];
        currentIndex = (currentIndex + 1) % names.length;
        lastUpdate = now;

        if(slowing){
          speed += 2; // verlangsamen
        }
      }

      if(!slowing || speed < 300){
        requestAnimationFrame(animate);
      } else {
        // Animation stoppen und gezogenen Namen anzeigen
        drawArea.innerText = receiver;
        drawArea.style.fontSize = "2.5em";
        drawArea.style.color = "#ff0000";
      }
    }

    animate(performance.now());

    // Nach kurzer Zeit langsamer werden lassen
    setTimeout(()=>{ slowing = true; }, 1000);
  });

} else {
  // Admin-Modus
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

    localStorage.setItem("assignments", JSON.stringify(assignments));
    localStorage.setItem("tokenMap", JSON.stringify(tokenMap));

    // Links anzeigen
    const linksDiv = document.getElementById("links");
    linksDiv.innerHTML = "<h3>Teilnehmer-Links:</h3>";
    for(const [token, giver] of Object.entries(tokenMap)){
      const link = document.createElement("a");
      link.href = `?token=${token}`;
      link.target = "_blank";
      link.innerText = giver;
      linksDiv.appendChild(link);
    }
  });
}
