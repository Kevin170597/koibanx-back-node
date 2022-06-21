const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const mongoosePaginate = require('mongoose-paginate-v2');
const dotenv = require('dotenv');
dotenv.config();

var PORT = process.env.PORT || 3001;

const url = process.env.MONGO;
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('connected'))
.catch((err) => console.log(err))

const shopSchema = mongoose.Schema({
    _id: String,
    commerce: String,
    cuit: String,
    concept1: Number,
    concept2: Number,
    concept3: Number,
    concept4: Number,
    concept5: Number,
    concept6: Number,
    current_balance: Number,
    active: Boolean,
    last_sale: String
}, { versionKey: false })

shopSchema.plugin(mongoosePaginate);

const shopMdel = mongoose.model('shops', shopSchema);

app.use(express.json());
app.use(cors({
    origin: '*',
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.get('/', (req, res) => {
    res.send('Hello Koibanx')
})

app.get('/stores', async (req, res) => {
    const page = req.query.p || 1;
    const q = JSON.parse(req.query.q);

    let options = {};

    options.active = req.query.active;
    q._id ? options._id = { "$regex": `${q._id}` } : '';
    q.commerce ? options.commerce = { "$regex": `${q.commerce}` } : '';
    q.cuit ? options.cuit = { "$regex": `${q.cuit}` } : '';

    const shops = await shopMdel.paginate(options, { page: page, limit: 14})
    res.status(200).json({
        shops,
        total: shops.length
    })
})

app.listen(PORT, () => console.log('server in port ' + PORT));