const {
  getPokemon,
  getPokemonId,
  getPokemonIdAndCreateFile,
} = require("./module/pokemon");

console.log("1. Get All Pokemon (limit and offset default in 20) ");
console.log("2. Get Pokemon by ID or name");
console.log("3. Get Pokemon by ID/name and create .txt");
console.log("0. Exit");

switch (parseInt(process.argv[2])) {
  case 1:
    getPokemon( process.argv[3], process.argv[4] );
    break;
  case 2:
    getPokemonId(process.argv[3]);
    break;
  case 3:
    getPokemonIdAndCreateFile(process.argv[3]);
    break;
  default:
    console.log("WARNING: Invalid Arguments");
    break;
}
