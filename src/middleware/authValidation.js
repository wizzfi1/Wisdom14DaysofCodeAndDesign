exports.validateRegister = (req, res, next) => {
  const { email, password, name } = req.body;

  // Basic validation
  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      error: 'Please provide all required fields'
    });
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide email and password'
    });
  }
  
  next();
};