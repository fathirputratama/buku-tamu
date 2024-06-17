const jwt = require('jsonwebtoken');
const Company = require('../models/company');
require("dotenv").config();

const authenticateToken = async (req, res, next) => {
  const tokenHeader = req.header('Authorization');
  
  if (!tokenHeader) {
    return res.status(401).json({ status: false, code: 401, message: 'Authorization header missing' });
  }

  const parts = tokenHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ status: false, code: 401, message: 'Invalid Authorization header format' });
  }

  const token = parts[1];

  if (!token) {
    return res.status(401).json({ status: false, code: 401, message: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_PASS, async (err, user) => {
    if (err) {
      return res.status(403).json({ status: false, code: 403, message: 'Invalid token' });
    }

    if (user.exp && user.exp < Date.now() / 1000) {
      return res.status(403).json({ status: false, code: 403, message: 'Token has expired' });
    }

    try {
      const guid_company = user.guid_company;
      if (!guid_company) {
        return res.status(403).json({ status: false, code: 403, message: 'No guid_company in token' });
      }

      const foundCompany = await Company.findOne({ guid_company });
      if (!foundCompany) {
        return res.status(404).json({ status: false, code: 404, message: 'Company not found' });
      }

      req.user = { guid_company: foundCompany.guid_company };
      next();
    } catch (error) {
      res.status(500).json({ status: false, code: 500, message: 'Internal server error' });
    }
  });
};

module.exports = authenticateToken;
