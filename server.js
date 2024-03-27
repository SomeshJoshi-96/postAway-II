import server from "./index.js";
import { connectUsingMongoose } from "./src/config/db.js";


server.listen(8000, async () => {
  await connectUsingMongoose();
  console.log(`server is running at port 8000`);
});
