const express = require('express');
const router = express.Router();
const roleController = require('../controllers/RoleController');

// CRUD routes for roles
router.route('/')
    .get(roleController.getRoles)
    .post(roleController.createRole);

router.route('/:id')
    .get(roleController.getRole)
    .put(roleController.updateRole)
    .delete(roleController.deleteRole);

module.exports = router;
