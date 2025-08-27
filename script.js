// Teilnehmerliste und feste Zuweisung
const participants = ["Jens","Susanne","Claus","Inga","Ole","Caroline","Henrik","Annbritt"];
const fixedGiver = "Jens";
const fixedReceiver = "Susanne";

// Prüfen, ob URL einen Token enthält
const urlParams = new URLSearchParams(window.location.search);
const tokenParam = urlParams.get("token");

if(tokenParam){
  // Teilnehmer-Modus: nur eigene Zuweisung
  const tokenMap = JSON.parse(localStorage.getItem("tokenMap"));
  const assignments = JSON.parse(localStorage.getItem("assignments"));
  const giver = tokenMap[tokenParam];
  const receiver = assignments[giver];

  document.getElementById("admin").style.display = "none";

  // Rad vorbereiten
  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const radius = canvas.width / 2;
  const names = participants.slice();

  // Rad zeichnen
  function drawWheel(angle=0){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const arc = (2 * Math.PI) / names.length;

    for(let i=0;i<names.length;i++){
      ctx.beginPath();
      ctx.moveTo(radius,radius);
      ctx.arc(radius,radius,radius, i*arc + angle, (i+1)*arc + angle);
      ctx.fillStyle = i%2===0 ? "#ffcc00":"#ff6666";
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.translate(radius,radius);
      ctx.rotate(i*arc + arc/2 + angle);
      ctx.textAlign = "right";
      ctx.fillStyle="#000";
      ctx.font="16px Arial";
      ctx.fillText(names[i], radius-10, 0);
      ctx.restore();
    }

    // Pfeil oben zeichnen
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(radius-10,0);
    ctx.lineTo(radius+10,0);
    ctx.lineTo(radius,20);
    ctx.closePath();
    ctx.fill();
  }

  drawWheel();

  // Spin-Button
  document.getElementById("spinBtn").addEventListener("click", ()=>{
    let angle = 0;
    let speed = 0.3 + Math.random()*0.5; // Startgeschwindigkeit
    let stopAngle = (names.indexOf(receiver) + 0.5) * (2*Math.PI)/names.length;

    function animate(){
      speed *= 0.97; // verlangsamen
      angle += speed;
      drawWheel(angle);

      // Prüfen ob das Rad fast am Ziel ist
      let currentIndex = Math.floor(((2*Math.PI - (angle % (2*Math.PI))) / (2*Math.PI)) * names.length) % names.length;

      if(speed > 0.001 || currentIndex !== names.indexOf(receiver)){
        requestAnimationFrame(animate);
      } else {
        angle = 2*Math.PI - (names.indexOf(receiver)+0.5)*(2*Math.PI)/names.length;
        drawWheel(angle);
        document.getElementById("assignment").innerText = `Du beschenkst: ${receiver}`;
      }
    }
    animate();
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
      link.innerText = `${giver}`;
      linksDiv.appendChild(link);
    }
  });
}
