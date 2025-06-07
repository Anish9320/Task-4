const Auth = (req,res,next) =>{
    const authHeader = req.headers['auth'];

    if(authHeader != process.env.AUTH){
        return res.status(403).send({message: "Authentication Failed"})
    }
    next()
}

module.exports = {Auth}