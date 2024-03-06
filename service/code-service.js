const UserModel = require("../models/user-model")
const CodeModel = require("../models/code-model")
const ApiError = require("../exceptions/api-error")
const {generateFourDigitCode} = require("../utils/generate-four-digit-code")
const mailService = require("./mail-service")
const tokenService = require("./token-service");

class CodeService {
    async sendCode(email) {
        const candidate = await UserModel.findOne({ email })

        if (!candidate) {
            throw ApiError.BadRequest(`Пользователь не найден`)
        }

        const activationCode = generateFourDigitCode();
        await mailService.sendPasswordRecovery(email, activationCode)

        const codeData = await CodeModel.findOne({ email })

        if(codeData) {
            codeData.code = activationCode
            codeData.save()
        } else {
            await CodeModel.create({ code: activationCode, email })
        }

        return tokenService.generateShortToken({ email })
    }

    async validateCode(email, code) {
        const codeData = await CodeModel.findOne({ email })

        if(!codeData) {
            throw ApiError.BadRequest(`Пользователь не найден`)
        }

        if(code !== codeData.code) {
            throw ApiError.BadRequest('Неккоректный код')
        }

        await this.clearCode(email)
    }

    async clearCode(email){
        const codeData = await CodeModel.findOne({ email })
        if(codeData) {
            await CodeModel.deleteOne({ email: email })
        }
    }
}

module.exports = new CodeService()
