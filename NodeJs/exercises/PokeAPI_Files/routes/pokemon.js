const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");

let pokemonUrl = "https://pokeapi.co/api/v2/pokemon/";

//? http status codes
//? 100 - informational
//? 200 - success
//? 300 - redirection
//? 400 - client error
//? 500 - server error

// router.get("/", (req, res) => {
//   res.send("Hello from the Pokemon API!");
// });

//http://localhost:3000/api/pokemon
router.get("/", (req, res) => {
  axios
    .get(pokemonUrl)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

//*with limit and offset for pagination
//http://localhost:3000/api/pokemon/pagination?limit=10&offset=0
router.get("/pagination", (req, res) => {
  let limit = req.query.limit;
  let offset = req.query.offset;
  axios
    .get(pokemonUrl + "?limit=" + limit + "&offset=" + offset)
    .then((response) => {
      res.json(response.data);
      //   let { next, previous, results,count } = response.data;
      //   res.json({ next, previous, results ,count});
    })
    .catch((err) => {
      res.send(err);
    });
});

//http://localhost:3000/api/pokemon/limit/10/offset/0
router.get("/limit/:limit/offset/:offset", (req, res) => {
  let limit = req.params.limit;
  let offset = req.params.offset;

  axios
    .get(pokemonUrl + `?limit=${limit}&offset=${offset}`)
    .then((response) => {
      res.json(response.data);
      //   let { next, previous, results } = response.data;
      //   res.json({ next, previous, results });
    })
    .catch((err) => {
      res.send(err);
    });
});

//*ID and name
//http://localhost:3000/api/pokemon/1
router.get("/:id", (req, res) => {
  //or router.get("/:id?", (req, res) => {
  let id = req.params.id;

  axios
    .get(pokemonUrl + id)
    .then((response) => {
      //res.json(response.data);
      let { name, id, height, weight, types } = response.data;
      res.json({ name, id, height, weight, types });
    })
    .catch((err) => {
      res.send(err);
    });
});

//*Pagination and id together
//http://localhost:3000/api/pokemon/1?limit=10&offset=0
router.get("/:id?", (req, res) => {
  console.log("combined");
  let limit = req.query.limit;
  let offset = req.query.offset;
  let id = req.params.id ? req.params.id : "";

  axios
    .get(pokemonUrl + id + `?limit=${limit}&offset=${offset}`)
    .then((response) => {
      id == ""
        ? res.json(response.data)
        : res.json({
            name: response.data.name,
            id: response.data.id,
            height: response.data.height,
            weight: response.data.weight,
            types: response.data.types,
          });
      // let { name, id, height, weight, types } = response.data;
      // res.json({ name, id, height, weight, types });
    })
    .catch((err) => {
      res.send(err);
    });
});

// Id and create .txt file
//http://localhost:3000/api/pokemon/createFile/1

router.get("/createFile/:id", (req, res) => {
  let id = req.params.id;

  axios
    .get(pokemonUrl + id)
    .then(async (response) => {
      let data = {
        name: response.data.name,
        id: response.data.id,
        height: response.data.height,
        weight: response.data.weight,
        types: response.data.types,
      };

      //create .txt file
      try {
        //await fs.promises.writeFile("pokemonFromId.txt", JSON.stringify(data));
        //or appendFile
        await fs.promises.appendFile("pokemonFromId.txt", JSON.stringify(data)+'\n');
      } catch (error) {
        console.log(error);
      }

      res.json(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

// //*Pagination,id and create .txt together
//http://localhost:3000/api/pokemon/1?limit=10&offset=0
router.get("/:id?", (req, res) => {
  console.log("combined");
  let limit = req.query.limit;
  let offset = req.query.offset;
  let id = req.params.id ? req.params.id : "";

  axios
    .get(pokemonUrl + id + `?limit=${limit}&offset=${offset}`)
    .then(async (response) => {
      let data =
        id == ""
          ? response.data
          : {
              name: response.data.name,
              id: response.data.id,
              height: response.data.height,
              weight: response.data.weight,
              types: response.data.types,
            };

      //create .txt file
      try {
        await fs.promises.writeFile("pokemon.txt", JSON.stringify(data));
        //or appendFile
        //await fs.promises.appendFile("pokemon.txt", JSON.stringify(data)+'\n');
      } catch (error) {
        console.log(error);
      }

      res.json(data);

      // let { name, id, height, weight, types } = response.data;
      // res.json({ name, id, height, weight, types });
    })
    .catch((err) => {
      res.send(err);
    });
});

//*Read from .txt file

//http://localhost:3000/api/pokemon/readFile/txt

router.get("/readFile/txt", async (req, res) => {
  try {
    let data = await fs.promises.readFile("pokemonFromId.txt", "utf8");
    res.send(data)
    //res.json(JSON.parse(data));
  } catch (error) {
    res.status(404).send("File not found or error in reading file" + error);
  }
});

module.exports = router;

//https://www.cloudnweb.dev/2021/4/pagination-nodejs-mongoose - pagination with mongoose
