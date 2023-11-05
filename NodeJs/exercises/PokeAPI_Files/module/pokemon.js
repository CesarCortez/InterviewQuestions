const axios = require("axios");
const fs = require("fs");
//require('dotenv').config(); 

let pokemonUrl = "https://pokeapi.co/api/v2/pokemon/";
//console.log(process.env.POKEMON_URL);
//let pokemonUrl = process.env.POKEMON_URL;

//? http status codes
//? 100 - informational
//? 200 - success
//? 300 - redirection
//? 400 - client error
//? 500 - server error

async function getPokemon(limit, offset) {
  try {
    let response = await axios.get(pokemonUrl + "?limit=" + limit + "&offset=" + offset);
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
}

async function getPokemonId(idName) {
  try {
    let response = await axios.get(pokemonUrl + idName);
    let { name, id, height, weight } = response.data;
    console.log(`Name: ${name}`);
    console.log(`ID: ${id}`);
    console.log(`Height: ${height}`);
    console.log(`Weight: ${weight}`);
  } catch (err) {
    console.log("ERROR: Invalid Arguments, Pokemon not found");
    console.log(err);
  }
}

async function getPokemonIdAndCreateFile(idName) {
  try {
    let response = await axios.get(pokemonUrl + idName);
    let { name, id, height, weight } = response.data;
    fs.writeFile("pokemonCLI.txt", JSON.stringify({name,id,height,weight}), (err) => {
      if (err) throw err;
      console.log("File Created");
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getPokemon,
  getPokemonId,
  getPokemonIdAndCreateFile,
};
