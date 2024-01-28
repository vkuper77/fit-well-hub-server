 function generateFourDigitCode() {
    const min = 1000; // Минимальное значение (включительно)
    const max = 9999; // Максимальное значение (включительно)
    // Генерация случайного числа в диапазоне [min, max]
    const code = Math.floor(Math.random() * (max - min + 1)) + min;
    return code.toString();
}

 module.exports = {generateFourDigitCode}
