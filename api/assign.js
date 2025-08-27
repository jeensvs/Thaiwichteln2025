const crypto = require("crypto");

const participants = ["Jens","Susanne","Claus","Inga","Ole","Caroline","Henrik","Annbritt"];
const fixedGiver = "Jens";
const fixedReceiver = "Susanne";

module.exports = (req,res) => {
  let others = participants.filter(p => p!==fixedGiver && p!==fixedReceiver);
  const shuffled = others.slice().sort(()=>Math.random()-0.5);

  const result = {};
  result[fixedGiver] = fixedReceiver;
  for(let i=0;i<others.length;i++){
    result[others[i]] = shuffled[i];
  }

  // Tokens generieren
  const tokens = {};
  participants.forEach(p => {
    tokens[p] = crypto.randomBytes(8).toString("hex");
  });

  res.status(200).json({assignments: result, tokens});
};
