import express from 'express';
import { engine } from 'express-handlebars';
import conn from './db/conn.mjs';

import User from './models/User.mjs';
import Address from './models/Address.mjs';

const app = express();

app.use(express.urlencoded({
    extended: true,
}));

app.use(express.json());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.post('/users/create', async (req, res) => {

    let { name, occupation, newsletter } = req.body;

    if (newsletter === 'on') {
        newsletter = true;
    } else {
        newsletter = false;
    }

    console.log(req.body);

    await User.create({ name, occupation, newsletter });

    res.redirect('/');

});

app.get('/users/create', (req, res) => {
    res.render('adduser');
});

app.get('/users/:id', async (req, res) => {
    const id = req.params.id;

    const user = await User.findOne({ raw: true, where: { id: id } });

    res.render('userview', { user });
});

app.post('/users/delete/:id', async (req, res) => {

    const id = req.params.id;

    await User.destroy({ where: { id: id } });

    res.redirect('/');

});

app.post('/users/update', async (req, res) => {

    let { id, name, accupation, newsletter } = req.body;

    console.log(req.body);

    if (newsletter === 'on') {
        newsletter = true;
    } else {
        newsletter = false;
    }

    const userData = {
        id, name, accupation, newsletter,
    };

    await User.update(userData, { where: { id: id } });

    res.redirect('/');

})

app.get('/users/edit/:id', async (req, res) => {

    const id = req.params.id;

    try {
        const user = await User.findOne({ include: Address, where: { id: id } });

        res.render('useredit', { user: user.get({ plain: true }) });

    } catch (err) {
        console.log(err);
    }


});

app.post('/address/create', async (req, res) => {

    const { UserId, street, number, city } = req.body;

    const address = { UserId, street, number, city };

    await Address.create(address);

    res.redirect(`/users/edit/${UserId}`);
});

app.post('/address/delete', async (req, res) => {
    const UserId = req.body.UserId;
    const id = req.body.id;

    await Address.destroy({ where: { id: id } });

    res.redirect(`/users/edit/${UserId}`);
});

app.get('/', async (req, res) => {

    const users = await User.findAll({ raw: true });

    console.log(users);

    res.render('home', { users: users });
});

conn.sync().then(() => {
    app.listen(3000);
}).catch((err) => console.log(err));