const http = require('http');
const PORT = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

// Данные вашего аккаунта в smsc.ru
const SMSC_LOGIN = 'vk_705153';
const SMSC_PASSWORD = 'kikite227228!'; // Используйте md5 или другого типа хеширование, если необходимо

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Функция для отправки СМС через smsc.ru
async function sendSms(phone, message) {
    try {
        const response = await axios.get('https://smsc.ru/sys/send.php', {
            params: {
                login: SMSC_LOGIN,
                psw: SMSC_PASSWORD,
                phones: phone,
                mes: message,
                charset: 'utf-8',
                fmt: 3 // Формат ответа JSON
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(`Ошибка при отправке СМС: ${error}`);
    }
}

app.post('/send-form', async (req, res) => {
    const phoneNumber = req.body.phone;
    const confirmationCode = Math.floor(1000 + Math.random() * 9000); // 4-значный код

    try {
        // Отправляем СМС
        const result = await sendSms(phoneNumber, `Ваш код подтверждения: ${confirmationCode}`);
        console.log(result);

        // Здесь код подтверждения должен быть сохранен в базе данных вместе с номером телефона

        res.json({ success: true, message: 'Код подтверждения отправлен.', sid: result.id });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Добавьте свой код для проверки кода подтверждения здесь...

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
