const {registration,verifyEmail,resendEmailVerification,logIn,
    signOut,allLoginUsers,changePassword,forgotPassword,resetPassword} = require('../Controller/userController')
const {userAuth} = require('../Middleware/authMiddleware')


const express = require('express');
const router = express.Router();


router.post('/signup', userAuth, registration)
router.put('/verify/:id/:token',userAuth, verifyEmail)
router.put('/re-verify',userAuth, resendEmailVerification)
router.post('/login',userAuth,logIn)
router.put('/logout/:id',userAuth, signOut)
router.get('/loginusers',userAuth, allLoginUsers)
router.put('/changepassword/:id',userAuth, changePassword)
router.post('/changepassword/:id/:token', resetPassword)
router.post('/resetemail', forgotPassword)

module.exports = router;