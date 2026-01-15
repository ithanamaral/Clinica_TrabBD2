module.exports = (req, res, next) => {
    if (req.userTipo === 'enfermeiro' || req.userTipo === 'admin') {
        return next();
    }
    return res.status(403).json({ erro: "Acesso restrito a Enfermeiros ou Administradores." });
};