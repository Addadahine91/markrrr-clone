const express = require('express');
const router = express.Router();
const LetterController = require('../controllers/letter');
const checkAuth = require("../middleware/check-auth");

router.post('/create-letter', checkAuth ,LetterController.createLetter);

router.get('', checkAuth, LetterController.getLetters);

router.delete('/:id', checkAuth, LetterController.deleteLetter);

router.post('/edit-letter', checkAuth, LetterController.editLetter);

router.get('/:id', checkAuth, LetterController.getLetter);

module.exports = router;
