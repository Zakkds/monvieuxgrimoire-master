module.exports = (req, res, next) => {
    const maxSize = 1000000 // Taille max de 1 Mo
    const fileSize = req.headers['content-length']

    if(fileSize > maxSize){
        return res.status(400).json({ message: "Fichier trop volumineux" });
    } else {
        next();
    }
}