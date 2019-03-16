var express = require('express')
    ,router = express.Router();
// TODO: should this index be outside the controller folder ?

// TODO: include below imports in separate file
const AuthenticationController = require('../controllers/authentication'),
    passportService = require('../config/passport'),
    passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

// const router = require('../router');

router.use('/me', requireAuth, require('./user'));
router.use('/feed', requireAuth, require('./events'));
router.use('/person', requireAuth, require('./personProfile'));
router.use('/company', requireAuth,require('./company'));
router.use('/leads',requireAuth, require('./lead'));
router.use('/leadStages', requireAuth, require('./leadStage'));
router.use('/salesUserStats', requireAuth, require('./salesUserStats'));
router.use('/dashboard', requireAuth, require('./dashboard'));
router.use('/stats', requireAuth, require('./summaryInterval'));

// TODO: remove below router items and put in router

authRoutes = express.Router();
router.use('/auth', authRoutes);
// Registration route
router.post('/register', AuthenticationController.register);
// Login route
// router.post('/login2', requireLogin, AuthenticationController.login2);

router.post('/login', AuthenticationController.login);

router.get('/hola', requireAuth, function(req, res) {

        res.status(200).json({"status":"Logged in User"});
});
module.exports = router;

