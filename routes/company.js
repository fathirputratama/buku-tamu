module.exports = app => {
    const companyController = require('../controllers/company');
    const router = require('express').Router();
    const authenticateToken = require('../middleware/index')
    const multer = require('multer');
    const { v4: uuidv4 } = require('uuid');
    const path = require('path');

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/'); // Ensure files are uploaded to 'uploads/' directory
        },
        filename: function (req, file, cb) {
            cb(null, uuidv4() + path.extname(file.originalname));
        }
    });
    const upload = multer({ storage: storage });

    router.post('/addcompany', companyController.register);
    router.post('/logincompany', companyController.login);
    router.get('/', authenticateToken, companyController.getCompanyByGuid);
    router.put('/', authenticateToken, upload.single('image'), companyController.updateCompany);
    router.post('/resetpassword', companyController.resetPasswordWithoutLogin);

    
    
    router.get('/uploads/:fileName', companyController.getImage);

    app.use('/company', router);
};
