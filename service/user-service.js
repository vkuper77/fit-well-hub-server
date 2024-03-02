const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const {generateFourDigitCode} = require("../utils/generate-four-digit-code");

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationCode = generateFourDigitCode();

        const user = await UserModel.create({email, password: hashPassword, activationCode})
        await mailService.sendActivationMail(email, activationCode).catch(console.error);

        const userDto = new UserDto(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async activate(userId, activationCode) {
        const user = await UserModel.findById(userId)
        if (user.isActivated) {
            throw ApiError.BadRequest('Пользователь уже активирован');
        }
        if (user.activationCode !== activationCode) {
            throw ApiError.BadRequest('Неккоректный код активации')
        }
        user.isActivated = true;
        user.set({ activationCode: undefined })
        await user.save();
    }

    async resendCode(userId) {
        const user = await UserModel.findById(userId)
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден')
        }
        if (user.isActivated) {
            throw ApiError.BadRequest('Пользователь уже активирован');
        }
        const activationCode = generateFourDigitCode();
        await mailService.sendActivationMail(user.email, activationCode).catch(console.error);
        user.activationCode = activationCode;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }
}

module.exports = new UserService();
