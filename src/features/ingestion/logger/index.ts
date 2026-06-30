import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
});
// log_level을 env에 작성하는 이유를 확인할 것 모두 완료된 이후에 확인하여 혼란을 주지 않는다
