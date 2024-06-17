const jwt = require('jsonwebtoken');
const Superadmin = require('../models/superadmin');
require('dotenv').config();

const protectRoutesBeforeLogin = async (req, res, next) => {
    try {
        // Check if there is a token in the header
        const tokenHeader = req.header('Authorization');
        if (!tokenHeader) {
            return res.status(401).json({ message: 'Token is missing.' });
        }

        // Extract the token from the header
        const token = tokenHeader.split(' ')[1];

        // Verify the token
        jwt.verify(token, process.env.JWT_PASS, async (err, decodedToken) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token.' });
            }

            // Check if the superadmin exists
            const superadmin = await Superadmin.findOne({ email: decodedToken.email });
            if (!superadmin) {
                return res.status(404).json({ message: 'Superadmin not found.' });
            }

            // Attach the superadmin information to the request object
            req.superadmin = superadmin;
            next();
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const protectRoutesAfterLogin = async (req, res, next) => {
    try {
        // Check if there is a token in the header
        const tokenHeader = req.header('Authorization');
        if (!tokenHeader) {
            return res.status(401).json({ message: 'Token is missing.' });
        }

        // Extract the token from the header
        const token = tokenHeader.split(' ')[1];

        // Verify the token
        jwt.verify(token, process.env.JWT_PASS, async (err, decodedToken) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token.' });
            }

            // Check if the user is a superadmin
            const superadmin = await Superadmin.findOne({ email: decodedToken.email });
            if (!superadmin) {
                return res.status(404).json({ message: 'Superadmin not found.' });
            }

            // Attach the superadmin information to the request object
            req.superadmin = superadmin;
            next();
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = protectRoutesAfterLogin;
module.exports = protectRoutesBeforeLogin;
