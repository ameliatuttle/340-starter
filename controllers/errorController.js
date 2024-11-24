// Controller to trigger an error
exports.trigger500 = (req, res, next) => {
    // Throwing an error intentionally to simulate a server issue
    const err = new Error("Don't worry! This is on purpose!");
    err.status = 500;
    next(err); 
  };
  