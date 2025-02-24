import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import User from "../db/models/User.js";
import SessionsCollection from "../db/models/Session.js";

const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log("Authorization Header:", authorization);

    if (!authorization || !authorization.startsWith("Bearer ")) {
      console.log("❌ Access token is missing");
      throw createHttpError(401, "Access token is missing");
    }

    const token = authorization.split(" ")[1]; // "Bearer tokenString"
    console.log("Extracted Token:", token);

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET); // Token'ı doğrula
      console.log("✅ Token verified:", decoded);
    } catch (error) {
      const errorMessage = error.name === "TokenExpiredError" ? "Access token expired" : "Invalid access token";
      console.log("❌ Token verification failed:", errorMessage);
      throw createHttpError(401, errorMessage);
    }

    // Session kontrolü
    const session = await SessionsCollection.findOne({ accessToken: token });
    console.log("Session Found:", session);
    if (!session) {
      console.log("❌ Session not found");
      throw createHttpError(401, "Session not found");
    }

    // Token süresinin dolup dolmadığını kontrol et
    if (Date.now() > new Date(session.accessTokenValidUntil).getTime()) {
      console.log("❌ Access token expired (session expired)");
      throw createHttpError(401, "Access token expired");
    }

    // Kullanıcıyı session üzerinden doğrula
    const user = await User.findById(decoded.userId).select("-password");
    console.log("User Found:", user);
    if (!user) {
      console.log("❌ User not found");
      throw createHttpError(401, "User not found");
    }

    req.user = user; // Kullanıcı bilgisini req içine ekle

    console.log("✅ Authentication successful");
    next(); // Middleware’den çık

  } catch (error) {
    console.error("❌ Authentication Error:", error.message);
    next(error); // Hata yönetimine yönlendir
  }
};

export default authenticate;
