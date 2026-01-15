module.exports = (req, res, next) => {
    if (req.userTipo === 'recepcionista' || req.userTipo === 'admin') {
        return next();
    }
    return res.status(403).json({ erro: "Acesso restrito a Recepcionistas ou Administradores." });
};