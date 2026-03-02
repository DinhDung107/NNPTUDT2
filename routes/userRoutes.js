const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// Custom routes for enable/disable
router.post('/enable', userController.enableUser);
router.post('/disable', userController.disableUser);

// CRUD routes for users
router.route('/')
    .get(userController.getUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
