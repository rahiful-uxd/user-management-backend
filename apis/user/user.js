const pool = require('../../components/mysql');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const { validate } = require('./validation');
const { result } = require('lodash');
const jwt = require("jsonwebtoken");
const config = require('../../service.json');
const _ = require('lodash');
const checkLogin = require('./authorize');
const upload = require('./user_image');

router.post('/createuser', async (req, res) => {
    const userData = req.body;
    const { error } = validate(userData);
    if (error) return res.status(400).send(error.details[0].message);
    userData.password = await bcrypt.hash(userData.password, 10);
    try {
        const createUserQuery = `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`;
        pool.query(createUserQuery,
            [userData.name, userData.email, userData.password],
            (err, result) => {
                if (err) throw err;
                return res.status(201).send({
                    "message": "User created successfully",
                    "result": req.body
                })
            });
    } catch (err) {
        return res.status(400).send({
            "message": "Something went wrong",
            error: err.message
        })
    }
});

router.get('/showalluser', checkLogin, async (req, res) => {
    try {
        const showAllUsersQuery = `SELECT * FROM user`;

                pool.query(showAllUsersQuery, (err, dbResult) => {
                    if (err) res.send("Errors are:-->", err);
                    res.status(200).send({
                        "message": "All Users showed successfully",
                        "result": dbResult
                    });
        });
    } catch (err) {
        return res.status(400).send({
            "message": "Something went wrong",
            error: err.message
        })
    }
});

router.post('/userlogin', async (req, res) => {
    const { email, password } = req.body;

    const { error } = validate({ email, password });
    if (error) return res.status(400).send(error.details[0].message);

    const loginQuery = 'SELECT * FROM user WHERE email = ?';
    pool.query(loginQuery, [email], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({ error: 'Failed to fetch user data' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
            if (bcryptErr) {
                console.error('Error comparing passwords:', bcryptErr);
                return res.status(500).json({ error: 'Authentication failed' });
            }

            if (!bcryptResult) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, config.JWT_SECRET, { expiresIn: '9h' });
            res.status(200).json({
                "message": "User loged in successfully",
                token: token,
                user: _.pick(user, ["id", "name", "email"])
            });
        });
    });

});

router.patch('/updateuser/:id', async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;

    const { error } = validate(userData);
    if (error) return res.status(400).send(error.details[0].message);
    userData.password = await bcrypt.hash(userData.password, 10);

    try {
        const updateUserQuery = `UPDATE user SET name = ?, email= ?, password= ? WHERE id= ?`;
        pool.query(updateUserQuery,
            [userData.name, userData.email, userData.password, userId],
            (err, result) => {
                if (err) throw err;
                res.status(200).send({
                    "message": "Student updated successfully",
                    "result": req.body
                });
            });

    } catch (err) {
        return res.status(400).send({
            "message": "Something went wrong",
            error: err.message
        })
    }
});

router.delete('/deleteuser/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const deleteUserQuery = `DELETE FROM user WHERE id=?`;
        pool.query(deleteUserQuery, userId, (err, result) => {
            if (err) throw err;
            res.status(200).send({
                "message": `User ${userId} deleted successfully`
            });
        });
    } catch (error) {
        return res.status(400).send({
            "message": "Something went wrong",
            error: error.message
        });
    }
});

router.post('/uploadimage', checkLogin, upload.single('photo'), async (req, res) => {

    if (req.errerror_for_file) res.status(404).send("Only jpg, png and jpeg file are allowed !");

    const loginId = req.id;
    const fileName = req.file.filename;
    try {
        const uploadImageQuery = `UPDATE user SET photo= ? WHERE id= ?`;
        pool.query(uploadImageQuery, [fileName, loginId], (err, result) => {
            if (err) {
                console.error('Error fetching user data:', err);
                return res.status(500).json({ error: 'Failed to fetch user data' });
            }

            res.status(200).send({
                "message": `Image uploaded successfully for ${loginId}`,
                result: result
            });

        });
    } catch (error) {
        return res.status(400).send({
            "message": "Something went wrong",
            error: error.message
        });
    }
});



module.exports = router;