import JWT from "jsonwebtoken";




const userAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization

  console.log('Authorization Header:', authHeader); // Add this log
  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    return next("Authentication failed")
  }

  const token = authHeader?.split(" ")[1];
  console.log('Token:', token); // Add this log
  console.log('Amit is Mandhana',token);
  // localStorage.setItem("bearerToken", token);
  try {
    const userToken = JWT.verify(token, 'xfcgffsasetuksddryjnn');
    req.body.user = {
      userId: userToken.userId,
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ success: "failed", message: "Session expired, please log in again" });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ success: "failed", message: "Invalid token, please log in again" });
    } else {
      res.status(401).json({ success: "failed", message: "Authentication failed" });
    }
  }
  
};


 export default  userAuth;



