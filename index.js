require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware');

let URL_DB;
const PORT = process.env.PORT || 3000;
const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));
app.use('/api', router);
app.use(errorMiddleware);

if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development') {
    URL_DB = process.env.DEV_DB_URL;
}

if (process.env.NODE_ENV === 'production') {
    URL_DB = process.env.DB_URL;
}

const start = async () => {
    try {
        await mongoose.connect(URL_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()
