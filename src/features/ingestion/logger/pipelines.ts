import { logger } from "./index";

export const discoverLogger = logger.child({
  pipeline: "discover",
});

export const ingestionLogger = logger.child({
  pipeline: "ingestion",
});

export const recoveryLogger = logger.child({
  pipeline: "recovery",
});
