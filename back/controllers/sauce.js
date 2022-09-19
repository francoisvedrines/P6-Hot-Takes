/************************************************************/
/************* Controller sauce *****************************/
/************************************************************/

const Sauce = require('../models/Sauce')

// module de modification de ficher

const fs = require('fs')

function createSauce  (req, res)  {
  const sauceObject = JSON.parse(req.body.sauce)
  //ajout des informations du formulaire a partir du model sauce
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  })
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch(error => res.status(400).json({ error }))
}

function modifySauce  (req, res) {
  //réécrit l'objet sauce avec les nouvelles valeurs du formulaires
  //2 params on updateOne: filter, update
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  } : {
    ...req.body
  }
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        res.status(404).json({ message: 'sauce inexistante' })
      }
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ message: 'acces non authorisé' })
      }
      if (req.file) {
        const filename = sauce.imageUrl.split("/images")[1];
        fs.unlink(`${`images/${filename}`}`, () => {
        })
      }
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(400).json({ error }))
}

function deleteSauce  (req, res)  {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        res.status(404).json({ message: 'sauce inexistante' })
      }
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ message: 'acces non authorisé' })
      }
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
          const filename = sauce.imageUrl.split("/images")[1];
          fs.unlink(`${`images/${filename}`}`, () => {
            res.status(200).json({ message: 'Sauce supprimée !' })
          })
        })
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }))

}

function getAllSauces  (req, res) {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.statut(400).json({ error }))
}

function getSauce  (req, res)  {
  return Sauce.findOne({ _id: req.params.id })
}

function getOneSauce (req, res) {
  getSauce(req, res)
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({ error }));
}



function likeSauce  (req, res) {
  const like = req.body.like;
  const userId = req.body.userId;
  const sauceId = req.params.id;

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      switch (like){
        case 1:
          if(!sauce.usersLiked.includes(userId)){
            if(sauce.usersDisliked.includes(userId)) return res.status(403).json({ message: ' double vote interdit' })
            Sauce.updateOne({ _id: sauceId } , { $inc: { likes: 1 } , $push: { usersLiked: userId }})
              .then( () => res.status(200).json({ message: 'Like ajouté !' }))
              .catch(error => res.status(400).json({ error }))
          }
          break;
          case -1:
            if(!sauce.usersDisliked.includes(userId)){
              if(sauce.usersLiked.includes(userId)) return res.status(403).json({ message: ' double vote interdit' })
            Sauce.updateOne({ _id: sauceId } , { $inc: { dislikes: 1 } , $push: { usersDisliked: userId }})
              .then( () => res.status(200).json({ message: 'Dislike ajouté !' }))
              .catch(error => res.status(400).json({ error }))
          }
          break;
          case 0:
          sauce.usersLiked.includes(userId) ? 
          Sauce.updateOne({ _id: sauceId } , { $inc: { likes: -1 } , $pull: { usersLiked: userId } })
          .then(() => { res.status(200).json({ message: 'like supprimé !' }) })
          .catch(error => res.status(400).json({ error })) : 
          Sauce.updateOne({ _id: sauceId } , { $inc: { dislikes: -1 } , $pull: { usersDisliked: userId } })
            .then(() => { res.status(200).json({ message: 'dislike supprimé !' }) })
            .catch(error => res.status(400).json({ error }))
            break;
            default: res.status(400).send({ message: `la valeur ${like} n'est pas valide` })
      }
    })
  }

module.exports =  { getOneSauce , getAllSauces, createSauce, modifySauce, deleteSauce, likeSauce }