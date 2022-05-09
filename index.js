const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

mongoose
.connect("mongodb://localhost:27017/yelpcamp")
.then(() => console.log("DB working!"))
.catch((error) => console.log(error));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
    const campground = await new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    // eval(require('locus'));
    try{
        const { id } = req.params;
        const campground = await Campground.findById(mongoose.Types.ObjectId(id));
        res.render('campgrounds/edit', {campground});
    } catch(err){
        console.log(err);
        res.send('error');
    }
    
})

app.get('/campgrounds/:id', async (req, res) => {
    try{
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/show', {campground});
    } catch(err){
        console.log(err);
        res.send('error');
    }
});


app.put('/campgrounds/:id', async (req, res) => {
    try{
        const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
        res.redirect(`/campgrounds/${req.params.id}`);
    } catch(err){
        console.log(err);
        res.send('error');
    }
})

app.delete('/campgrounds/:id', async (req, res) => {
    try{
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect('/campgrounds');
    } catch(err){
        console.log(err);
        res.send('error');
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('server started on port 3000');
});