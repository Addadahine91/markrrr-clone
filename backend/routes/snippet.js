const express = require('express');
const router = express.Router();
const SnippetController = require('../controllers/snippet');
const checkAuth = require("../middleware/check-auth");

router.post('', checkAuth ,SnippetController.createSnippet);

router.get('', checkAuth, SnippetController.getSnippets);

router.delete('/:id', checkAuth, SnippetController.deleteSnippet);

router.post('/edit-snippet', checkAuth, SnippetController.editSnippet);

router.get('/:id', checkAuth, SnippetController.getSnippet);

module.exports = router;
