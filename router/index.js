const Router = require('express').Router
const {body} = require('express-validator')
const userController = require('../controllers/user-controller')
const authMiddleware = require('../middlewares/auth-middleware')

const router = new Router()

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', authMiddleware, userController.logout);
router.post('/activate', authMiddleware, userController.activate);
router.post('/resendCode', authMiddleware, userController.resendCode);
router.post('/sendCode', userController.sendCode);
router.post('/validateCode', userController.validateCode);
router.post('/changePassword', userController.changePassword);
router.get('/refresh', userController.refresh);

module.exports = router
