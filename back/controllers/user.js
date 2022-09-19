/************************************************************/
/************** Controller user *****************************/
/************************************************************/
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config()
// variables d'environnement
const keyToken = process.env.KEY_TOKEN

//fonction de création d'un compte
exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User ({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(() => res.status(201).send({message: 'utilisateur créé !'}))
                .catch(error => res.status(409).send({ message: 'User pas enregistré : ' + error}))
        })
        .catch(error => res.status(500).json({error}))
}

//fonction de login
exports.login = (req, res) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if (user === null){
            res.status(401).send({message: 'Paire identifiant/mot de passe incorrecte'})
        }else{
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {    
                if(!valid) {
                    res.status(401).send({message: 'Paire identifiant/mot de passe incorrecte'})
                }else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            keyToken,
                            { expiresIn: '12h'}
                        )
                    })
                }
            })
            .catch( error => {
                res.status(500).send({error})
            })
        }
    })
    .catch(error => {
        res.status(500).send( {error} )
    })
}