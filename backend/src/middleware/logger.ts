import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    const method = req.method;
    const path = req.originalUrl || req.url;
    const status = res.statusCode;

    console.log(`${method} ${path} ${status} ${duration}ms`);
  });

  next();
};
