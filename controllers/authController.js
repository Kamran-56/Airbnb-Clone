const { check, validationResult } = require("express-validator");
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        activePage: 'login',
        insideHeading: 'Login to your account',
        isLoggedIn: false,
        errors: [],
        oldInput: {
            email: ''
        },
        user: null
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'SignUp',
        activePage: 'Signup',
        insideHeading: 'Signup to your account',
        isLoggedIn: false,
        errors: [],
        oldInput: {firstName:"", lastName:"", email:"", password:"", userType:""},
        user: null
    });
}

exports.postLogin = async (req, res, next) => {

      console.log("========== POST LOGIN ==========");
    console.log("BODY:", req.body);

    const { email, password } = req.body;    // we put async await because
    const user = await User.findOne({email: email});
    if (!user) {
        return res.status(422).render('auth/login', {
            pageTitle: "Login",
            activePage: "login",
            insideHeading: "Login to your account",
            isLoggedIn: false,
            errors: ["User does not exist"],
            oldInput: {email},
            user: null
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);  // compare the password entered by the user with the hashed password stored in the database
    if (!isMatch) {
        return res.status(422).render('auth/login', {
            pageTitle: "Login",
            activePage: "login",
            insideHeading: "Login to your account",
            isLoggedIn: false,
            errors: ["Invalid password"],
            oldInput: {email},
            user: null
        });
    }

    req.session.isLoggedIn = true;
    req.session.userId = user._id.toString();
    req.session.userType = user.userType;

req.session.save((err) => {
    if (err) {
        console.error("SESSION SAVE ERROR:", err);
        return next(err);
    }

    res.redirect('/');
});
}

exports.postSignup = [
    check('firstName')
    .trim()
    .isLength({ min: 2, max: 30 }).withMessage('First name must be between 2 and 100 characters')
    .matches(/^[A-Za-z]+$/).withMessage('First name must contain only letters'),

    check('lastName')
    .matches(/^[A-Za-z]+$/).withMessage('Last name must contain only letters'),

    check('email')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),


    check('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[@!#]/).withMessage('Password must contain at least one special character')
    .withMessage('Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .trim(),


    check('confirmPassword')
    .trim()
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),

    check('userType')
    .notEmpty().withMessage('User type is required')
    .isIn(['guest', 'host']).withMessage('Invalid user type'),

    check('terms')
    .notEmpty().withMessage('You must accept the terms and conditions')
    .custom((value, {req}) => {
        if (value !== req.body.terms) {
            throw new Error('You must accept the terms and conditions');
        }
        return true;
    }),

    (req, res, next) => {
        const { firstName, lastName, email, password, userType } = req.body;
        const errors = validationResult(req);
    console.log('req.body:', req.body);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            pageTitle: 'SignUp',
            activePage: 'signup',
            insideHeading: 'Signup to your account',
            isLoggedIn: false,
            errors: errors.array().map(err => err.msg),
            oldInput: {firstName, lastName, email, password, userType},
            user: null
        })}

        bcrypt.hash(password, 12).then(hashedPassword => {           // encrypt the password using bcrypt with a salt of 12 rounds (actually hashing not encrypting)
            const user = new User({ firstName, lastName, email, password: hashedPassword, userType });
            return user.save();    // bcrypt.hash returns a promise, so we can chain a .then() to handle the result of the hashing operation. In this case, we create a new User instance with the hashed password and save it to the database.
        })
        .then(() => { // user.save returns a promise, so we can chain another .then() to handle the result of the save operation. In this case, we redirect the user to the login page after successful signup.
            res.redirect('/login');
        }).catch(err => {
            return res.status(422).render('auth/signup', {
                pageTitle: 'SignUp',
                activePage: 'signup',
                insideHeading: 'Signup to your account',
                isLoggedIn: false,
                errors: [err.message],
                oldInput: { firstName, lastName, email, password, userType },
                user: null
            });
        });
                
}];


exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect("/login"); 
    });
}

