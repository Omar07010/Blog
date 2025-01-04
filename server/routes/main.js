import express from 'express';
import Post from '../moduls/PostSchema.js';

const router = express.Router()

// GET method in HOME page:
router.get('/', async (req, res) => {
    
    try{
        const locals = {
            title: 'BLOG',
            descreption: 'Blog project by nodeJs, expres, ejs, and mongoDB'
        }
        
        const perPage = 10;
        let page = req.query.page || 1;  //بالمختصر، هاد الكود كيحدد عدد العناصر اللي فكل صفحة و كيتأكد من رقم الصفحة اللي بغينا نعرضوها.

        const data = await Post.aggregate( [ { $sort: {createdAt: -1} } ] )
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec()

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index',
           {locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });
    } 
    catch(err){
        console.log(err);
    }
 
});
// router.get('/', async (req, res) => {
//     const locals = {
//         title: 'BLOG',
//         descreption: 'Blog project by nodeJs, expres, ejs, and mongoDB'
//     }
//     try{
//         const data = await Post.find();
//         res.render('index',{locals, data});
        
//     }catch(err){
//         console.log(err);
//     }
// });
    

// GET method in POST:id page:
router.get('/post/:id', async (req, res) => {
    

    try{

        let slug = req.params.id;
        const data = await Post.findById({_id: slug});

        const locals = {
            title: data.title,
            descreption: 'Blog project by nodeJs, expres, ejs, and mongoDB'
        }
        
        res.render('post',{locals, data});
        
    }catch(err){
        console.log(err);
    }
});

// GET method in searchbtn page:
router.post('/search', async (req, res) => {

    try{
        const locals = {
            title: 'Search',
            descreption: 'Blog project by nodeJs, expres, ejs, and mongoDB'
        }

        let searchTerm = req.body.searchTerm;
        let searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9\s]/g, '')


        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },  // البحث في حقل العنوان بعبارة نمطية
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });
        
        res.render('search',{locals, data});
        
    }catch(err){
        console.log(err);
    }
});










// function insertPostData() {
//     Post.insertMany([
//         {
//             title: 'Buildin a Blog',
//             body: 'This is the body text'
//         },{
//             title: 'Buildin a Blog',
//             body: 'This is the body text'
//         },{
//             title: 'Buildin a Blog',
//             body: 'This is the body text'
//         }
//     ])
// }
// insertPostData();



router.get('/about', (req, res) => {
    res.render('about');
});

export default  router;