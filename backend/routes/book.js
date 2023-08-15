const express = require('express');

const router = express.Router();

const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer.config');
const sizeChecker = require('../middlewares/sizeChecker')

const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRating);
router.get('/:id', bookCtrl.getBook);
router.post('/', auth, sizeChecker, multer, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.postRating);
router.put('/:id', auth, sizeChecker, multer, bookCtrl.updateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);


module.exports = router;