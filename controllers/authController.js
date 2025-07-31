const User = require('../models/User');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');



// Register controller
exports.registerUser = async (req, res) => {
    const {firstname, lastname, email, password} = req.body;

    // check for missing fields 
    if(!firstname || !lastname || !email || !password) {
        return res.status(400).json({message: 'All fields are required'});
    }


    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({message: 'Invalid email format'});
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    if(!passwordRegex.test(password)) {
        return res.status(400).json({message:
            'password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
        });
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



// Register admin - only for existing admins
exports.registerAdmin = async(req, res) => {
    const {firstname, lastname, email, password} = req.body;

    // Validate fields
    if(!firstname || !lastname || !email || !password) {
        return res.status(400).json({message: 'All fields are required'});
    }

    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'Email already in use'});
        }

        const newUser = new User({
            firstname,
            lastname,
            email,
            password,
            isAdmin: true
        });

        await newUser.save();

        res.status(201).json({
            message: 'Admin created successfully',
            user: {
                id: newUser._id,
                firstname: newUser.firstname,
                email: newUser.email,
                isAdmin: newUser.isAdmin
            }
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};



// create admin
// const user = new User({
//     firstname: 'Admin',
//     lastname: 'Administrator',
//     email: 'admin@example.com',
//     isAdmin: true,
//     password: 'admin123456789'
// });

// user.save();