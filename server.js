const express = require('express');
const mongoose = require('mongoose');
const devuser = require('./devusermodel');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware')
const reviewData = require('./reviewmodel')
const app = express();
const cors = require('cors');
app.use(express.json());
app.get('/' ,  (req ,res) => {
return  res.send('Hello world!')
})





//DB connection 

mongoose.connect('mongodb+srv://developerhub:developerhub@cluster0.litiy.mongodb.net/developerhub?retryWrites=true&w=majority' , {})
.then(() => console.log('Db connected'))
.catch(err => console.log(err))



app.use(cors({
    origin : '*' 
    }))

//register api 
app.post('/register' , async (req , res) => {
    try {
        const {fullname ,email , mobile , skill , password , confirmpassword} = req.body;
        let exist = await devuser.findOne({email});
        if (exist) {
            return res.status(400).send('Email adress is already registered')
        }
        if (password != confirmpassword) {
            return res.status(400).send('Password mismatch');
        }
        const newuser = devuser({
            fullname ,email , mobile , skill , password , confirmpassword
        })
        await newuser.save();
        return res.status(200).send('User registered succesfuly')
    } catch (error) {
        console.log(error)
    }
})


//login 

app.post('/login' , async (req, res) => {
    const {email , password}  = req.body;
    try {
        let exist = await devuser.findOne({email});
        if (!exist) {
            return res.status(400).send('This email is not registered')
        }
        if (password != exist.password) {
            return res.status(400).send('This password is invalid')
        }

        let payload = {
            user : {
                id : exist.id
            }
        }

        jwt.sign(payload , 'jwtSecret' , {expiresIn : 3600000} , 
        (error , token) => {
            if (error) throw error
            return res.status(200).json({token})
        })

    } catch (error) {
        console.log(error)
    }
})

//all profiles

app.get('/allprofiles' ,middleware, async (req , res) => {
    try {
        const allprofiles = await devuser.find();
        return res.json(allprofiles)
    } catch (error) {
        console.log(error)
    }
})

//myprofile 
app.get('/myprofile' , middleware , async (req , res) => {
    try {
        let user = await devuser.findById(req.user.id);
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
})

//add review

app.post('/addreview' , middleware , async (req , res) => {
    try {
        const {reviewWorker , rating} = req.body;
        let exist = await devuser.findById(req.user.id);

        const newReview = reviewData({
            reviewProvider : exist.fullname , 
            reviewWorker , rating
        })
        await newReview.save();
        res.status(200).send('Review added successfully')
        
    } catch (error) {
        console.log(error)
    }
})

//myreviews 

app.get('/myreview' , middleware , async (req , res) => {
    try {
        let allreviews = await reviewData.find();
        let myreview = allreviews.filter(review => review.reviewWorker.toString() === req.user.id.toString())
        res.status(200).json(myreview)
    } catch (error) {
        console.log(error)
    }
})


app.listen(5001 , (req , res) => {
    console.log('server running ...')
})
