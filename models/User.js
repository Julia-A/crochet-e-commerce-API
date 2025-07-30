const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'First name is required']
    },
    lastname: {
        type: String,
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    }
}, {timestamps: true}
);


// Pre-save hook to hash password before saving in DB
userSchema.pre('save', async function (next) {
    // check if the password is newly modified or created
    if(!this.isModified('password')) return next();

    try {
        // hash the new password
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});



module.exports = mongoose.model('User', userSchema);