/************************************************************/
/***************** routes sauce *****************************/
/************************************************************/
const express = require('express')
const router = express.Router()

//module de gestion d'authentification
const auth = require('../middleware/auth')
//module de gestion de fichier
const multer = require('../middleware/multer-config')

const sauceCtrl = require('../controllers/sauce')

router.post('/', auth, multer, sauceCtrl.createSauce)
router.get('/', auth, sauceCtrl.getAllSauces)
router.get('/:id', auth, sauceCtrl.getOneSauce)
router.put('/:id', auth, multer, sauceCtrl.modifySauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce)
router.post('/:id/like' , auth, sauceCtrl.likeSauce )


module.exports = router