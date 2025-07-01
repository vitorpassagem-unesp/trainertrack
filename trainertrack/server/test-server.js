// Script de teste para verificar se o servidor está funcionando
const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

// Rota de teste
app.get('/test', (req, res) => {
    res.json({ message: 'Servidor funcionando!' });
});

app.listen(PORT, () => {
    console.log(`Servidor de teste rodando na porta ${PORT}`);
});
