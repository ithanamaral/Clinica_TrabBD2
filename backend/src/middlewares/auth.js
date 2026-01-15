const jwt = require('jsonwebtoken');
const TOKEN = process.env.TOKEN_SECRET;

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ erro: "Token não fornecido" });
    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, TOKEN);
        req.userId = decoded.id;
        req.userTipo = decoded.tipo;

        return next();
    } catch (err) {
        return res.status(401).json({ erro: "Token inválido" });
    }
};