const crypto = require('crypto');

const participants = ["Jens","Susanne","Claus","Inga","Ole","Caroline","Henrik","Annbritt"];
const fixedGiver = "Jens";
const fixedReceiver = "Susanne";

// Einfach im Speicher speichern für Demo
let assignments = {};
let tokens = {};

module.exports = (req, res) => {
  // Zufällige Zuweisung ohne Gegenseitigkeit
  let others = participants.filter(p => p!==fixedGiver && p!==fixedReceiver);
  const shuffled = others.slice().sort(()=>Math.random()-0.5);
  assignments = {};
  assignments[fixedGiver] = fixedReceiver;
  for(let i=0;i<others.length;i++){
    assignments[others[i]] = shuffled[i];
  }

  // Tokens erstellen
  tokens = {};
  for(const giver of participants){
    const token = crypto.randomBytes(8).toString('hex');
    tokens[token] = giver;
  }

  res.status(200).json({ message: "Zuweisungen erstellt", tokens });
}
