import dotenv from 'dotenv';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';

import adminRouter from './server/routes/admin.js';
import connectDB from './server/config/db.js';
import router from './server/routes/main.js';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import methodOverride from 'method-override';

dotenv.config(); // shoff wash shih

const app = express();
const PORT = 3000 || process.env.PORT;

// connect mongo db
connectDB()


app.use((req, res, next) => {
    res.locals.currentPage = req.path; // تعيين المسار الحالي إلى `res.locals`
    next();
});

//(methodOverride
app.use(methodOverride('_method'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'secret', // يمكنك تغيير هذا إلى مفتاح سري مناسب
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    // cookie: { secure: false } // يجب أن يكون true إذا كنت تستخدم HTTPS
}));

app.use(express.static('public'));

// Use express-ejs-layouts middleware
app.use(expressLayouts);
app.set('layout', './layouts/main');

// Set up EJS as the view engine
app.set('view engine', 'ejs');

app.use('/', router);
app.use('/', adminRouter);



app.listen(PORT, () => {
    console.log(`Server running on port: http://localhost:${PORT}`);
});