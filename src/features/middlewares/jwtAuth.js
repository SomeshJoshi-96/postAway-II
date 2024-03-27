import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  const { jwtToken } = req.cookies;
  jwt.verify(jwtToken, process.env.SECRET, (err, data) => {
    if (err) {
      res.status(400).json({ success: false, msg: "Please SignIn first!" });
    } else {
      console.log("data is", data);
      req._id = data.userID;
      req.email = data.email;
      console.log(req._id, req.email);
      next();
    }
  });
};
