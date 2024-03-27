import winston from "winston";
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-logging" },
  transports: [new winston.transports.File({ filename: "logs.txt" })],
});

const loggerMiddleware = async (req, res, next) => {
  // 1. Log request body.
  if (
    req.url.includes("posts") ||
    req.url.includes("comments") ||
    req.url.includes("likes") ||
    req.url.includes("friends") ||
    req.url.includes("otp")
  ) {
    const logData = `${Date.now()}-${req.url} - ${JSON.stringify(req.body)}`;
    logger.info(logData);
  }
  next();
};

export default loggerMiddleware;
