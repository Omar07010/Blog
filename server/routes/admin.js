import express from 'express';
import Post from '../moduls/PostSchema.js';
import User from '../moduls/UserSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const adminLayout = '../views/layouts/admin'


const adminRouter = express.Router();
const jwtSecret = process.env.JWT_SECRET;

// midllWare
const autMiddllWare = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({message: "Somthing Won't Wrong"})
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next()
    }catch(err){
        res.status(401).json({message: "Somthing Won't Wrong"})
    }
}





// GET method for ADMIN-LOGIN page
adminRouter.get('/admin', async (req, res) => {
    const locals = {
        title: 'ADMIN',
        descreption: 'Blog project by nodeJs, expres, ejs, and mongoDB'
    }
    try{
        const data = await Post.find();
        res.render('admin/index',{locals, layout: adminLayout}); //, layout: adminLayout
        
    }catch(err){
        console.log(err);
    }
});


// POST method for register-LOGIN page
adminRouter.post('/register', async (req, res) => {
    
    try{
        const { username, password, email} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        // التحقق من وجود البيانات المطلوبة
        if (!username || !password || !email) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const newUser = new User({
            username,
            password: hashedPassword,
            email
        });
        await newUser.save();
        
        res.redirect('/');
        // res.status(201).json({ message: 'User registered successfully', user: newUser });

    }
      
    catch(err){
        console.log(err);
    }
});


// POST method for CHECK-LOGIN page
adminRouter.post('/admin', async (req, res) => {
    
    try{
        console.log('Session object:', req.session);
        const { username, password} = req.body;
        
        const user = await User.findOne({ username });

        if (!user) {
           return res.status(401).json({message: 'User Not Found!'});
            
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({message: 'User Not Found!'});            
        }

        const token = jwt.sign({userId: user._id}, jwtSecret);
        res.cookie('token', token, {httpOnly: true});
        console.log('User session:', req.session.user);
        res.redirect('/dashboard')
        
    }catch(err){
        console.log(err);
    }
});

// GET DAHBORD
adminRouter.get('/dashboard', autMiddllWare, async(req, res) => {
    try{
        const locals = {
            title: 'Dashboard',
            descreption: 'Blog project by nodeJs, expres, ejs, and mongoDB'
        }

        const data = await Post.find()
        res.render('admin/dashboard', {locals, data})
    }catch(err){
        console.error('Error fetching dashboard data:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
 
})

// GET admin add-post
adminRouter.get('/add-post', async(req, res) => {
    try{
        const locals = {
            title: 'Add Post',
            descreption: 'Blog project by nodeJs, expres, ejs, and mongoDB'
        }

        const data = await Post.find()
        res.render('admin/add-post', {locals,
             data,
             layout: adminLayout
            })
    }catch(err){

    }
    
})

// POST admin add-post
adminRouter.post('/add-post', autMiddllWare, async(req, res) => {
    try{
        const locals = {
            title: 'Add Post',
            descreption: 'Blog project by nodeJs, expres, ejs, and mongoDB'
        }
        const {title, body} = req.body;

        const newPost = new Post({
            title,
            body
        });
        await newPost.save();
        res.redirect('/dashboard')
    }catch(err){
        console.error(err); 
        res.status(500).send('Internal Server Error'); 
    }
    
})

// DELETE Post
adminRouter.delete('/delete-post/:id', async (req, res) => {
    try{
        const userId = req.params.id;
        await Post.findByIdAndDelete(userId)
        res.redirect('/dashboard')
    }catch(err) {
        console.error(err)
        res.status(500).send('Error deleting post');
    }
})

// GET edit-post
adminRouter.get('/edit-post/:id', async(req, res) => {
    try{
        const locals = {
            title: 'Add Post',
            descreption: 'Blog project by nodeJs, expres, ejs, and mongoDB'
        }

        const postId = req.params.id;
        const post = await Post.findById(postId)

        res.render('admin/edit-post', {locals,
             post,
             layout: adminLayout
            })
    }catch(err){
        console.error(err)
        res.status(500).send('Error Getting post');
    }
    
})

// UPDATE /edit-post/:id
adminRouter.put('/edit-post/:id',  async (req, res) => {
    try{
        const userId = req.params.id;
        const { title, body } = req.body;
        const updatedPost  = await Post.findByIdAndUpdate(userId, { title, body })
        res.redirect('/dashboard')


    }catch(err){
        console.error(err)
        res.status(500).send('Error deleting post');
    }
    
})

// GET /logout
 adminRouter.get('/logout', async (req, res) => {
   
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error logging out');
            }
            res.redirect('/'); // إعادة التوجيه بعد تسجيل الخروج
    });
    
 })

export default  adminRouter;