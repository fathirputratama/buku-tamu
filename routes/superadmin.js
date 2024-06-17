module.exports = app => {
    const superadminController = require('../controllers/superadmin');
    const router = require('express').Router();
    const protectRoutesBeforeLogin = require('../middleware/superadmin');
    const protectRoutesAfterLogin = require('../middleware/superadmin');

    router.post('/addsuperadmin', superadminController.register);
    router.post('/loginsuperadmin', superadminController.login);
    router.get('/data',protectRoutesBeforeLogin, superadminController.findAll);
    router.put('/company/:guid_company/status', protectRoutesBeforeLogin, protectRoutesAfterLogin, superadminController.updateCompanyStatus);
    router.delete('/deletecompany/:guid_company', protectRoutesBeforeLogin, protectRoutesAfterLogin, superadminController.deleteCompany);
    
    app.use('/superadmin', router);
}
    
