import "dotenv/config";
import { app, PORT } from "./app";

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
