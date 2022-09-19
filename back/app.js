/************************************************************/
/************************ app *******************************/
/************************************************************/

//importation des modules nécessaires
const express = require('express')
const mongoose = require('mongoose')
const path = require ('path')
// sécurité: paramètrage en-tête http
const helmet = require('helmet') 
// sécurité: empèche l'usage de caractères dans les saisies pour attaque par injection
const mongoSanitize = require('express-mongo-sanitize') 
//importation du module de variable d'environnement
require('dotenv').config()

//importation des fichiers de routing
const userRoutes = require('./routes/user')
const sauceRoutes = require ('./routes/sauce')

// variables d'environnement
const userName= process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const accessMongo = process.env.DB_ACCESSMONGO

// création de l'application express
const app = express()
app.use(express.json())

//connection a la base de donnée mongo
mongoose.connect(`mongodb+srv://${userName}:${password}@${accessMongo}/P6?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))
    
   //déclaration des autorisations
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
      next()
})

//ajout de modules de sécurité    
app.use(helmet({crossOriginResourcePolicy: false}))
app.use(mongoSanitize())


app.use('/api/auth', userRoutes)
app.use('/api/sauces', sauceRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app