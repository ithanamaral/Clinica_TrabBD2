module.exports = (req, res, next) => {
    if (req.userTipo === 'medico' || req.userTipo === 'admin') {
        return next();
    }
    return res.status(403).json({ erro: "Acesso restrito a Médicos ou Administradores." });
};