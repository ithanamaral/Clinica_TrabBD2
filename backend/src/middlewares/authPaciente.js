module.exports = (req, res, next) => {
    if (req.userTipo === 'paciente' || req.userTipo === 'admin') {
        return next();
    }
    return res.status(403).json({ erro: "Acesso restrito a Pacientes ou Administradores." });
};