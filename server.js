import { createServer } from "https";
import { readFileSync } from "fs";
import next from "next";

const port = 5001;
const dev = true;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpsServer = createServer(
    {
      key: readFileSync("./localhost.key"),
      cert: readFileSync("./localhost.crt"),
    },
    (req, res) => {
      handle(req, res);
    }
  );

  httpsServer.listen(port, () => {
    console.log(`Next.js HTTPS server running at https://localhost:${port}`);
  });
});
