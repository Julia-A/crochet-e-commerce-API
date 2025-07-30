const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authorization middleware for protected routes\
const protect = async (req, res, next) => {
    // check if the request has an authorization header and that the authorization header starts with a string called "Bearer"
    let token;

   
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // split the authorization header using a space delimiter and then choose the 2nd item (index 1)
            token = req.headers.authorization.split(' ')[1];


            // then verify the token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user information to the request once the token is verified
            req.user = await User.findById(decodedToken.id).select('-password');

            next(); // passing the control to the next middleware or route
        } catch (err) {
            return res.status(401).json({message: 'Not authorized, token failed up'});
        }
    }

    if(!token) {
        return res.status(401).json({message: 'Not authorized, no token down'});
    }
    
};



module.exports = {protect};