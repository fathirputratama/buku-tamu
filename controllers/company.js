const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const company = require('../models/company');
const saltRounds = 10;
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Set destination to 'uploads/' directory
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

exports.register = (req, res) => {
    const plainPassword = req.body.password;

    company.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            return res.status(400).json({ status: false, code: 400, username: "email already exists" });
        } else {
            bcrypt.hash(plainPassword, saltRounds)
                .then((hashedPassword) => {
                    const guid = uuidv4();
                    const newCompany = new company({
                        guid_company: guid,
                        nama: req.body.nama,
                        alamat: req.body.alamat,
                        email: req.body.email,
                        no_telp: req.body.no_telp,
                        password: hashedPassword,
                        status: false,
                    });

                    newCompany.save()
                        .then(() => {
                            res.status(201).json({ status: true, code: 201, message: "company registered successfully" });
                        })
                        .catch((saveError) => {
                            res.status(500).json({ status: false, code: 500, message: saveError.message });
                        });
                })
                .catch((hashError) => {
                    return res.status(500).json({ error: hashError.message });
                });
        }
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const Company = await company.findOne({ email });

        if (!Company) {
            return res.status(401).json({ status: false, code: 401, message: 'Invalid credentials' });
        }
        if (Company.status === false) {
            return res.status(403).json({ status: false, code: 403, message: 'Account is not active' });
        }

        bcrypt.compare(password, Company.password)
            .then((match) => {
                if (match) {
                    const token = jwt.sign({ guid_company: Company.guid_company, email: Company.email }, process.env.JWT_PASS, { expiresIn: '12h' });
                    res.json({ status: true, code: 200, token, message: 'Login successful' });
                } else {
                    return res.status(401).json({ status: false, code: 401, message: 'Invalid credentials' });
                }
            })
            .catch((error) => {
                return res.status(500).json({ status: false, code: 500, message: error.message });
            });
    } catch (error) {
        return res.status(500).json({ status: false, code: 500, message: error.message });
    }
};

exports.getCompanyByGuid = (req, res) => {
    company.findOne({ guid_company: req.user.guid_company })
        .then(data => res.send({ status: true, code: 200, data: data }))
        .catch(err => res.status(500).send({ status: false, code: 500, message: err.message }));
};

exports.updateCompany = (req, res) => {
    const guid_company = req.user.guid_company;
    const { password, ...restBody } = req.body; // Exclude password from restBody

    const updateData = { ...restBody }; // Copy data from req.body excluding password

    // If an image is uploaded, add its path to updateData
    if (req.file) {
        updateData.image = req.file.filename; // Only store the filename, not the entire path
    }

    // Check if password is provided
    if (password) {
        bcrypt.hash(password, saltRounds)
            .then((hashedPassword) => {
                updateData.password = hashedPassword;

                company.findOneAndUpdate({ guid_company }, updateData, { new: true })
                    .then(data => {
                        if (!data) {
                            res.status(404).send({ status: false, code: 404, message: "Tidak bisa mengubah data" });
                        } else {
                            res.send({ status: true, code: 200, message: "Data berhasil diupdate", data });
                        }
                    })
                    .catch(err => res.status(500).send({ status: false, code: 500, message: err.message }));
            })
            .catch((hashError) => {
                return res.status(500).json({ status: false, code: 500, message: hashError.message });
            });
    } else {
        // If no password is provided, fetch the existing company data to get the current password
        company.findOne({ guid_company })
            .then(existingCompany => {
                if (!existingCompany) {
                    return res.status(404).send({ status: false, code: 404, message: "Company not found" });
                }

                // Do not include the password in the updateData if no new password is provided
                updateData.password = existingCompany.password;

                company.findOneAndUpdate({ guid_company }, updateData, { new: true })
                    .then(data => {
                        if (!data) {
                            res.status(404).send({ status: false, code: 404, message: "Tidak bisa mengubah data" });
                        } else {
                            res.send({ status: true, code: 200, message: "Data berhasil diupdate", data });
                        }
                    })
                    .catch(err => res.status(500).send({ status: false, code: 500, message: err.message }));
            })
            .catch(err => res.status(500).send({ status: false, code: 500, message: err.message }));
    }
};

// Serve uploaded images
exports.getImage = (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '../uploads', fileName);
    res.sendFile(filePath, err => {
        if (err) {
            res.status(404).send({ status: false, code: 404, message: 'File not found' });
        }
    });
};

exports.resetPasswordWithoutLogin = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await company.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: false, code: 404, message: 'Email tidak ditemukan' });
        }

        // Check if newPassword is provided
        if (!newPassword) {
            return res.status(400).json({ status: false, code: 400, message: 'Password baru diperlukan' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ status: true, code: 200, message: 'Password berhasil direset' });
    } catch (error) {
        res.status(500).json({ status: false, code: 500, message: error.message });
    }
};
