const assignments = require('./assign.js').assignments; // hier evtl in-memory oder DB
const tokens = require('./assign.js').tokens;

module.exports = (req,res)=>{
  const token = req.query.token;
  if(!token || !tokens[token]){
    return res.status(400).send("Ungültiger Token");
  }
  const giver = tokens[token];
  const receiver = assignments[giver];
  res.status(200).send(`Du beschenkst: ${receiver}`);
}
