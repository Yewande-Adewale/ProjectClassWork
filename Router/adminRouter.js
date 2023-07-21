const express = require('express');
const route = express.Router();
const {adminSignUp, adminLogIn, adminVerify, adminForgotPassword, adminResetPassword, adminChangePassword,allAdmins,oneAdmin,deleteAdmin,updateAdmin,SuperAdmin} = require('../Controller/isAdmin');

const {IsAdminAuth} = require('../Middleware/authMiddleware')


route.get('/alladmins',IsAdminAuth, allAdmins)
route.get('/admin/:id',IsAdminAuth, oneAdmin)
route.delete('/admin/:id',IsAdminAuth, deleteAdmin)
route.patch('/admin/:id', updateAdmin)
route.route('/adminsignup').post(adminSignUp)
route.route('/adminlogin').post(adminLogIn)
route.route('/adminVerify/:userid').post(adminVerify)
route.route('/adminForgotPassword').post(adminForgotPassword)
route.route('/adminchangepassword/:id/:token').post(adminResetPassword)
route.route('/adminchangepassword/:id').post(adminChangePassword)



module.exports = route;