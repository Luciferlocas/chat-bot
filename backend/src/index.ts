import express from "express";
import cors from "cors";
import config from "./config/env";

const app = express();
const PORT = config.PORT;

async function bootstrap() {
  try {
    app.set("trust proxy", 1);
    app.use(express.json());
    app.use(
      cors({
        origin: config.CORS_ORIGIN,
      })
    );

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error("Failed to bootstrap", error);
    process.exit(1);
  }
}

bootstrap();
