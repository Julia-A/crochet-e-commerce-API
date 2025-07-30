const User = require('../models/User');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');



// Register controller
exports.registerUser = async (req, res) => {
    const {firstname, lastname, email, password} = req.body;

    // Validate the fields
    if(!firstname || !lastname || !email || !password) {
        return res.status(400).json({message: 'All fields are required'});
    }

    try {
        // check if the user exists already
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: 'Email already in use'});
        }

        // else create the new user
        const newUser = new User({firstname, lastname, email, password});
        await newUser.save();


        // Return success
        return res.status(201).json({
            message: 'Registration successful',
            user: {
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email
            }
        });
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};


// Login - controller
exports.loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        // check if the user exists using the email
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: 'User not found'});
        }

        // Else, compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: 'Invalid email or password'});
        }


        // If password is a match, send token and the user info
        res.json({
            message: 'Login successful',
            token: generateToken(user._id),
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            }
        });
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}



// create admin
// const user = new User({
//     firstname: 'Admin',
//     lastname: 'Administrator',
//     email: 'admin@example.com',
//     isAdmin: true,
//     password: 'admin123456789'
// });

// user.save();