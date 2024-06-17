const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Superadmin = require('../models/superadmin');
const company = require('../models/company')
const saltRounds = 10;
require('dotenv').config();

// Register superadmin
exports.register = async (req, res) => {
    try {
        // Check if there is already a superadmin registered
        const existingSuperadmin = await Superadmin.findOne();
        if (existingSuperadmin) {
            return res.status(400).json({ message: 'Superadmin account already exists.' });
        }

        const plainPassword = req.body.password;
        bcrypt.hash(plainPassword, saltRounds)
            .then((hashedPassword) => {
                const newSuperadmin = new Superadmin({
                    email: req.body.email,
                    password: hashedPassword
                });

                newSuperadmin.save()
                    .then(() => {
                        res.status(201).json({ message: 'Superadmin registered successfully.' });
                    })
                    .catch((saveError) => {
                        res.status(500).json({ message: saveError.message });
                    });
            })
            .catch((hashError) => {
                return res.status(500).json({ message: hashError.message });
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login superadmin and generate JWT
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the superadmin by email
        const superadmin = await Superadmin.findOne({ email });

        if (!superadmin) {
            return res.status(404).json({ message: 'Superadmin account not found.' });
        }

        // Compare hashed passwords
        bcrypt.compare(password, superadmin.password)
            .then((match) => {
                if (match) {
                    // Generate JWT token
                    const token = jwt.sign({ email: superadmin.email }, process.env.JWT_PASS, { expiresIn: '12h' });
                    res.json({ status: true, code: 200, token, message: 'Login successful' });
                } else {
                    return res.status(401).json({ message: 'Invalid email or password.' });
                }
            })
            .catch((error) => {
                return res.status(500).json({ message: error.message });
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findAll = (req,res) => {
    company.find()
    .then(data => res.send({ status: true, code: 200, data: data }))
    .catch(err => res.status(500).send({ status: false, code: 500, message: err.message }));
}

// controller superadmin
exports.updateCompanyStatus = async (req, res) => {
    try {
        const { guid_company, status } = req.body;

        // Periksa apakah status yang diberikan adalah boolean
        if (typeof status !== 'boolean') {
            return res.status(400).json({ message: 'Status must be a boolean value.' });
        }

        // Temukan dan perbarui perusahaan berdasarkan guid_company
        const updatedCompany = await company.findOneAndUpdate({ guid_company }, { status }, { new: true });

        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found.' });
        }

        return res.json({ status: true, code: 200, data: updatedCompany, message: 'Company status updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tambahkan ini di awal handler deleteCompany untuk memeriksa seluruh request
exports.deleteCompany = (req, res) => {
    console.log('Request params:', req.params); // Log seluruh params
    const guid_company = req.params.guid_company;
    console.log(`guid_company: ${guid_company}`); // Gunakan backticks untuk template string

    if (!guid_company) {
        return res.status(400).send({ status: false, code: 400, message: "guid_company is required" });
    }

    company.findOneAndDelete({ guid_company })
        .then(data => {
            if (!data) {
                return res.status(404).send({ status: false, code: 404, message: "Company not found" });
            }
            res.send({ status: true, code: 200, message: "Company deleted successfully" });
        })
        .catch(err => {
            res.status(500).send({ status: false, code: 500, message: err.message });
        });
};

