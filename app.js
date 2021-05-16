const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();

// REALIZANDO CONEXÃO COM O BANCO DE DADOS
const connection = require('mysql').createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'exercicio'
});

// EMAIL
const nodemailer = require('nodemailer');
const { count } = require('console');

// CONFIGURANDO O ENVIO DE EMAIL
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '', // ESCONDENDO PARA SUBIR NO GIT
        pass: '' // ESCONDENDO PARA SUBIR NO GIT
    },
});

// CRIANDO O DIRETÓRIO PARA UPLOAD, SE NECESSÁRIO, E ALOCANDO O ARQUIVO
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            const dir = `./uploads/${req.body.username}`;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            callback(null, dir);
        },
        filename: (req, file, callback) => {
            callback(null, file.originalname);
        }
    })
});


function validate(req) {
    const fields = req.body;
    const error = {};

    // Campos Obrigatórios
    const required_fields = ['name', 'username', 'email', 'birthdate', 'phone', 'password'];
    for (const [key, value] of Object.entries(fields)) {
        if (required_fields.includes(key) && !value) {
            error[key] = 'Campo obrigatório';
        }
    }

    return error;
}

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./public'));

// ROTAS
app.get('/', (req, res) => {
    if (req.query.message) {
        res.render("index", {
            message: {
                text: req.query.message,
                type: req.query.type
            }
        });
    } else {
        res.render("index");
    }
});

app.post('/', upload.single('picture'), (req, res) => {
    // RESGATANDO OS DADOS ENVIADOS NO FORMULÁRIO DE CADASTRO
    let data = req.body;

    // CONFIGURANDO O CAMINHO DO ARQUIVO DE IMAGEM A SER GUARDADO NO BANCO DE DADOS
    if (req.file) data.picture = 'uploads/' + req.file.originalname + '-' + Date.now();

    // VERIFICANDO SE HÁ ERRO NOS DADOS INSERIDOS ANTES DE INSERI-LOS NO BANCO DE DADOS
    const result_validate = validate(req);
    if (Object.keys(result_validate).length > 0) {
        console.log(result_validate);
        res.render('index', {
            message: {
                text: 'Houve algum erro na inserção de dados',
                type: 'danger'
            },
            errors: result_validate,
            old: req.body
        });
        return;
    } else {
        // GUARDANDO OS DADOS NO BANCO
        connection.query(`INSERT INTO users SET ?`, data, (err, result) => {
            if (err) {
                console.log(err);
                res.redirect('/?message=Houve algum erro&type=danger')
            } else {
                transporter.sendMail({
                    from: 'Exercício de WEB 1',
                    to: req.body.email,
                    subject: 'Verificação de Email',
                    html: `<a href="localhost/verificar/${result.insertId}">Clique aqui para verificar seu email</a>`,
                });
                res.redirect('/?message=Cadastrado com sucesso&type=success')
            }
        });
    }
});

// VERIFICAÇÃO DE EMAIL
app.get('/verificar/:id', (req, res) => {
    connection.query('UPDATE users SET verified_at = ? WHERE id = ?', [new Date(), req.params.id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Conta verificada com sucesso')
        }
    });
    res.redirect('/?message=Conta verificada com sucesso&type=success');
});

app.listen(80, () => {
    console.log('SERVER ON');
});