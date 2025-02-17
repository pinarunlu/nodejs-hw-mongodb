import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

const startServer = async () => {
  // MongoDB bağlantısını kur
  await initMongoConnection();

  // Sunucuyu başlat
  setupServer();
};

startServer();

