
const express = require('express');
const router = express.Router();
const users = require('../data/users.js');
const middelware = require('../middlewares/middlewares.js');
const axios = require('axios');

const endpoint = `https://rickandmortyapi.com/api/character/`


router.get('/', (req, res) => {

    const loginForm = `
    <h1>BIENVENIDOS AL API DE RICK & MORTY </h1>
    <hr><br>
    <form action="/login" method="post">
        <label for="username">Usuario:</label>
        <input type="text" id="username" name="username" required><br><br>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" required><br><br>
        <button type="submit">Iniciar sesión</button>
    </form>
    <hr>
    `;
  
    res.send(loginForm);
  });


  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);
    
    if (user) {
        const token = middelware.generatorToken(user);
        //console.log(token);
        req.session.token = token;
        res.redirect('/search');
    } 
    else {
      res.status(401).send(`<h3>ERROR</h3>
      <p>Credenciales incorrectas!</p> 
      <hr>
      <a href="/">Home</a>`);
    }
   
  });



  router.get("/search", middelware.verifyToken, (req, res)=>{
    const user = req.user;
    

    if( req.session.token ) {
        const searchForm = `
        <h2>Introduce un nombre del personaje que quieras consultar</h2>
        <hr><br>
        <form action="/character" method="post">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" name="nombre" required><br><br>
          <button type="submit">Buscar Personaje</button>
        </form>
        <br>
        <a href="/character">Buscar todos los personajes</a>
        <br>
        <hr>
        <br>
        <form action="/logout" method="post">
            <button type="submit">Cerrar Sesión</button>
        </form>
        `;
        res.send(searchForm);
    }
    else {
        res.status(401).send(`<h3></h3>
        <p>Credenciales incorrectas!</p> 
        <form action="/logout" method="post">
        <a href="/">search</a>
        <br>
        <button type="submit">Cerrar Sesión</button>
        </form>
       `);
    }
   

  })

  router.get('/character', async (req,res)=>{
    const url = 'https://rickandmortyapi.com/api/character';
        try{
            const response = await axios.get(url);
            const arrayCharacter = response.data.results; // Crea una variable para seleccionar el primer personaje
            res.json(arrayCharacter);
        }
        catch{
            res.status(404).json({error: "Error al obtener los personajes "})


        }
    })

  router.post('/character', async (req,res)=>{
    const {nombre} = req.body;
    const url = `https://rickandmortyapi.com/api/character?name=${nombre}`;
    
    try{
        const response = await axios.get(url);
        const character  = response.data.results[0]; // Crea una variable para seleccionar el primer personaje
        const {name,status,species,gender,origin,image} = character;

        res.status(200).send(`<h3>INFO DEL PERSONAJE</h3>
        <p><span>Name: </span>${name}</p>
        <p><span>Status: </span>${status}</p>
        <p><span>Species: </span>${species}</p>
        <p><span>Gender: </span>${gender}</p>
        <p><span>Origin: </span>${origin.name}</p>
        <img src="${image}" alt="${name}">
        <hr>
        <a href="/search">Volver a Buscar</a>`);
    }
    catch{
        res.status(404).send(`<h3>ERROR</h3>
        <p>No se ha podido obtener el personaje. Prueba de nuevo.</p> 
        <hr>
        <a href="/search">Volver a Buscar</a>`);
    }

})

  router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });
  

  module.exports = router;