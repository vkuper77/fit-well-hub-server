const Router = require('express').Router
const {body} = require('express-validator')
const userController = require('../controllers/user-controller')
const authMiddleware = require('../middlewares/auth-middleware')
const accessMiddleware = require('../middlewares/access-middleware')

const router = new Router()

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', authMiddleware, userController.logout);
router.post('/activate', authMiddleware, userController.activate);
router.post('/registerCode', authMiddleware, userController.registerCode);
router.post('/sendCode', userController.sendCode);
router.post('/validateCode', accessMiddleware, userController.validateCode);
router.post('/changePassword', accessMiddleware, userController.changePassword);
router.get('/refresh', userController.refresh);

module.exports = router
