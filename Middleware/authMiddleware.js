const jwt = require('jsonwebtoken');
const userModel = require('../Model/userModel');

// auth Middleware
const userAuth = (req, res, next)=>{
    const hasAuthorization = req.headers.authorization;
    if(!hasAuthorization) {
        res.status(403).json({
            message: 'No Authorization Found'
        });
    } else {
        const token = hasAuthorization.split(' ')[1];
        try {
            console.log(req.headers)
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = JSON.stringify(decodedToken);
            req.userId = decodedToken.userId;
            req.userEmail = decodedToken.email;
            req.username = decodedToken.username;
            next()
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }
};

// const authenticator = async(req,res,next)=>{
//     const user = await userModel.findById(req.params.id)
//     const token = user.token;
//     await jwt.verify(token.process.env.JWT_SECRETE,(error,paylode)=>{
//         if(error){
//             res.status(403).json({
//                 message:"Invalid Token"
//             })
//         }else{
//             req.user = paylode
//             next()
//         }
//     })
// }


const IsAdminAuth = (req, res, next)=>{
        isSignIn(req, res,()=>{
             console.log(req.user);
            if(req.user.superAdmin){
                next()
            }else{
                res.status(403).json({message: "You are not an admin"})
            }
        })
    
    }

    // const isSuperAuth = async(req,res,next)=>{
    //     authenticator(req, res,()=>{
    //         //const {id} = req.params;
    //         console.log(req.admin);
    //         if(req.user.superAdmin){
    //             next()
    //         }else{
    //             res.status(403).json({message: "You are not a superadmin"})
    //         }
    //     })
    
    // }


    // }



    

module.exports = {userAuth,IsAdminAuth}