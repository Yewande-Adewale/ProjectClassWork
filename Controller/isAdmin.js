require('dotenv').config()
 const adminModel = require('../Model/isAdmin')
 const bcrypt = require('bcrypt')
 const jwt = require('jsonwebtoken')
 const sendMail = require('../Middleware/authMiddleware')
 
 exports.adminSignUp = async (req, res)=>{
 try {
     const {username, email, password} = req.body;
     const saltPassword = await bcrypt.genSaltSync(12);
     const hashPassword = await bcrypt.hashSync(password, saltPassword)
 
     const data = {
         username,
         email,
         password: hashPassword
     }
 
     const createAdmin = new adminModel(data)
     const myToken = await jwt.sign({
         id: createAdmin._id,
         email: createAdmin.email,
         password: createAdmin.password,
     }, process.env.JWT_SECRETE, {
         expiresIn: "5m"
     })
 
     createAdmin.token = myToken
     await createAdmin.save()
 
     const verifyLink = `${req.protocol}://${req.get("host")}/api/adminVerify/${createAdmin._id}`
     const message = `Thank you for registering us. Please click on this link ${verifyLink} to verify your account`;
     sendMail({
         email: createAdmin.email,
         subject: "Kindly Verify",
         message,
     });
     res.status(201).json({
         message: "Admin created",
         data: createAdmin
     })
     } catch (error) {
         res.status(400).json({
             message: error.message
         })
     }
 
 
 exports.adminLogIn = async(req,res) =>  {
     try{
         const {email,password} = req.body
         // const id = req.params.id;
         const check = await adminModel.findOne({email: email})
         console.log(check)
         if(!check) res.status(404).json({message:'Not found'})
         const isPassword =await bcrypt.compare(password,check.password)
         if(!isPassword) res.status(404).json({message:'Email or password incorrect'})
 
         const myToken = jwt.sign({
             id:check._id,
             password: check.password, 
             superAdmin:check.superAdmin}, process.env.JWT_SECRETE, {expiresIn: "1d"})
 
         check.token = myToken 
         await check.save()
          res.status(201).json({
             message:"Successful",
             data:check
          })
     }catch(e){
         res.status(400).json({
             message:e.message
         })
     }
 }
 
 exports.adminVerify = async (req, res) => {
     try{    
         const userid = req.params.userid
         const user = await adminModel.findById(userid)
         await adminModel.findByIdAndUpdate(
             user._id,
             {
                 verify: true
             },
             {
                 new : true
             }
         )
 
         res.status(200).json({
             message: "you have been verified"
         })
 
     }catch(err){
         res.status(400).json({
             message:err.message
         })
     }
 }
 
 
 exports.adminForgotPassword = async (req, res) => {
     try{
         const {email} = req.body
         const userEmail = await adminModel.findOne({email})
         if(!userEmail) return  res.status(404).json({ message: "Email not recognized" })
         const myToken = jwt.sign({
             id: userEmail._id,
             superAdmin: userEmail.superAdmin},
              process.env.JWT_SECRETE, {
                 expiresIn: "5m"
             })
 
         const VerifyLink = `${req.protocol}://${req.get("host")}/api/changepassword/${userEmail._id}/${myToken}`
         const message = `Use this link ${VerifyLink} to change your password`;
         adminSendEmail({
           email: userEmail.email,
           subject: "Reset Pasword",
           message,
         })
         
         res.status(202).json({
             message:"email have been sent"
         })
 
         // console.log(userEmail);
     }catch(err){
         res.status(400).json({
             message:err.message
         })
     }
 }
 
 exports.adminResetPassword = async (req, res) => {
     try {
         const {password} = req.body
         const id = req.params.id
         const passwordchange = await adminModel.findById(id)
         const salt = bcrypt.genSaltSync(10);
         const hash = bcrypt.hashSync(password, salt);
 
         await adminModel.findByIdAndUpdate(passwordchange._id,{
             password: hash
         },{new: true})
 
         res.status(202).json({
             message:"password updated"
         })
 
     } catch (err) {
         res.status(400).json({
             message:err.message
         })
     }
 }
 
 exports.adminChangePassword = async (req, res) => {
     try {
         const {password} = req.body
         const id = req.params.id
         const passwordchange = await adminModel.findById(id)
         const isPassword =await bcrypt.compare(password, passwordchange.password)
         const salt = bcrypt.genSaltSync(10);
         const hash = bcrypt.hashSync(password, salt);
 
         await adminModel.findByIdAndUpdate(passwordchange._id,{
             password: hash
         },
         {
             new: true
         })
 
         res.status(202).json({
             message:"password updated"
         })
     } catch (err) {
         res.status(400).json({
             message:err.message
         })
     }
 }
 
 exports.allAdmins = async (req, res)=>{
     try {
         const getAllAdmins = await adminModel.find()
         
         if (getAllAdmins) {
             // const {token,password,...others}=getAllAdmins._id
             console.log(getAllAdmins)
             res.status(200).json({
                 numberOfadmin: getAllAdmins.length,
                 message: "All Admins",
                     data: getAllAdmins
         }) 
         // console.log(getAll)
         } else {
             res.status(404).json({
                 message: "No admin in the database"
             });
         }
     } catch(err) {
         res.status(400).json({
             message: err.message
         });
     }
 }
 
 
 exports.oneAdmin = async (req, res) => {
     const id = req.params.id;
     const anAdmin = await adminModel.findById(id);
     if (anAdmin) {
         res.status(200).json({
             message: "An Admin with ID" + id,
             data: anAdmin
         })
     } else {
         res.status(404).json({
             message: "Unable to find Admin with ID" + id,
         })
     }
 }
 
 exports.deleteAdmin = async (req, res) => {
     const id = req.params.id;
     const deletedAdmin = await adminModel.findByIdAndDelete(id);
     if (deletedAdmin) {
         res.status(200).json({
             message: "Successfully deleted admin with ID " + id,
             data: deletedAdmin
         })
     } else {
         res.status(404).json({
             message: "Unable to delete Admin with ID" + id,
         })
     }
 
 }
 
 
 exports.updateAdmin = async (req, res) => {
    const {id} = req.params
     const updatedAdmin = await adminModel.findByIdAndUpdate(id);
     if (updatedAdmin) {
         res.status(200).json({
             message: "Successfully Updated admin with ID: " + id,
             data: updatedAdmin
         })
     } else {
         res.status(404).json({
             message: err.message
         })
     }
 
 }}

 exports.SuperAdmin = async(req,res)=>{
    try{
        const {userId} = req.params;
        const superAdmin = await isSuperAdminModel.findByIdAndUpdate(userId, {isAdmin:true, isSuperAdmin:true},{new:true})
        res.status(200).json({
            message: "Successfull", superAdmin})
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
 };
 

