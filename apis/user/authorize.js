const jwt = require('jsonwebtoken');
const config = require('../../service.json');

const checkLogin = async (req, res, next)=>{
    try{
        let token = req.header('Authorization');
    if (token) {
      token = token.split(" ")[1].trim();
      const decode = jwt.verify(
        token,
        config.JWT_SECRET
      );

      const { id, email } = decode;
    //   console.log("Id are:", id);
    //   console.log("Email are:", email);
      req.id = id;
      req.email = email;
      next();
    //Checking from the database

    } else {
      res.status(402).json({
        status: 402,
        success: false,
        message: 'Token unavailable',
        isLogin: false,
      });
    }
    } catch(err){
        res.status(401).json({
            message: err.message,
            body: null,
          });
    }
}

module.exports = checkLogin;

