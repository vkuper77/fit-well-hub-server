const codeModel = require('../models/code-model');

class CodeService {
    async saveCode(userId, code) {
        const codeData = await codeModel.create({user: userId, code})
        return codeData;
    }

    async removeCode(code) {
        const codeData = await codeModel.deleteOne({user: userId, code})
    }

    async findCode(code) {
        const codeData = await codeModel.findOne({user: userId, code})
        return codeData;
    }
}

module.exports = new CodeService();
