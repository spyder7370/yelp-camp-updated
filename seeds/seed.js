const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./helper')

mongoose
    .connect("mongodb://localhost:27017/yelpcamp")
    .then(() => console.log("DB working!"))
    .catch((error) => console.log(error));

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10);
        const camp = await new Campground({
            author: '627a02e705d8e9e389367a5c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi minus sunt perspiciatis doloribus, provident ducimus molestias aspernatur maiores laudantium nobis possimus est deleniti totam facilis quaerat sint, blanditiis quas hic.',
            price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})