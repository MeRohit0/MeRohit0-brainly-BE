import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET_USER;

interface UserIdRequest extends Request {
  userId?: string;
}

interface JwtPayload {
  id: string;
}   //or i can just use the @ts-ignore

export const userMiddleware = (
  req: UserIdRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  const decoded = jwt.verify(header as string, JWT_SECRET!) as JwtPayload;
  if (decoded) {
    req.userId = decoded.id;
    next();
  } else {
    res.status(403).json({
      message: "signin again",
    });
  }
};
