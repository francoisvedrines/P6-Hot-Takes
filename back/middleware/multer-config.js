/************************************************************/
/************* middleware multer ****************************/
/************************************************************/
const multer = require('multer')

//type d'extentions de ficher
const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
}

//stokage des fichiers dans le dossier images
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    //renommage des fichiers
    filename:(req, file, callback) =>{
        const name = file.originalname.split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + extension)
    }
})

module.exports = multer({storage: storage}).single('image')