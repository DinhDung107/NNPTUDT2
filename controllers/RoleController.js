const Role = require('../models/Role');

// Get all roles (excluding soft deleted)
exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find({ isDeleted: false });
        res.status(200).json({ success: true, count: roles.length, data: roles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get single role by Id (excluding soft deleted)
exports.getRole = async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) {
            return res.status(404).json({ success: false, error: 'Role not found' });
        }
        res.status(200).json({ success: true, data: role });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create a new role
exports.createRole = async (req, res) => {
    try {
        const role = await Role.create(req.body);
        res.status(201).json({ success: true, data: role });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update a role
exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        );
        if (!role) {
            return res.status(404).json({ success: false, error: 'Role not found' });
        }
        res.status(200).json({ success: true, data: role });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Soft delete a role
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!role) {
            return res.status(404).json({ success: false, error: 'Role not found' });
        }
        res.status(200).json({ success: true, data: {}, message: 'Role soft deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
