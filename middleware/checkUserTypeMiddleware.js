exports.checkUserType = (userType = []) => {
    return (req, res, next) => {
      if (!userType.includes(req.user.userType)) {

        return res.render('Errors/403Error');
      }
      next();
    };
  };