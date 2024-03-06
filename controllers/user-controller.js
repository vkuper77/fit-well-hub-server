const userService = require('../service/user-service');
const codeService = require('../service/code-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const { email, password } = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            await codeService.clearCode(email)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const { code } = req.body
            const { id } = req.user
            await userService.activate(id, code)
            return res.json({ success: true })
        } catch (e) {
            next(e)
        }
    }

    async sendCode(req, res, next) {
        try {
            const { email } = req.body
            const data = await codeService.sendCode(email)
            return res.json({ success: true, ...data })
        } catch (e) {
            next(e)
        }
    }

    async changePassword(req, res, next) {
        try {
            const { password } = req.body
            const { email } = req.user
            await userService.changePassword(email, password)
            return res.json({ success: true })
        } catch (e) {
            next(e)
        }
    }

    async registerCode(req, res, next) {
        try {
            const { id } = req.user
            await userService.registerCode(id)
            return res.json({ success: true })
        } catch (e) {
            next(e)
        }
    }

    async validateCode(req, res, next) {
        try {
            const { code } = req.body
            const { email } = req.user
            await codeService.validateCode(email, code)
            return res.json({ success: true })
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
}


module.exports = new UserController();
