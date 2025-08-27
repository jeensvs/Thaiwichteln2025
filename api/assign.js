module.exports = (req, res) => {
  // Teilnehmerliste
  const participants = ["Jens", "Susanne", "Claus", "Inga", "Ole", "Caroline", "Henrik", "Annbritt"];

  const fixedGiver = "Jens";
  const fixedReceiver = "Susanne";

  // Restliche Teilnehmer
  let others = participants.filter(p => p !== fixedGiver && p !== fixedReceiver);

  // Funktion: Derangement ohne Selbst- oder Gegenseitigkeit
  function shuffleNoMutual(arr) {
    let shuffled;
    let attempts = 0;
    do {
      shuffled = arr.slice().sort(() => Math.random() - 0.5);
      attempts++;
      if(attempts > 1000) break;
    } while(shuffled.some((v,i) => v === arr[i] || (i>0 && shuffled[i-1]===arr[i])));
    return shuffled;
  }

  const shuffled = shuffleNoMutual(others);

  const result = {};
  result[fixedGiver] = fixedReceiver;

  for(let i=0; i<others.length; i++){
    const giver = others[i];
    const receiver = shuffled[i];
    result[giver] = receiver;
  }

  res.status(200).json(result);
};
