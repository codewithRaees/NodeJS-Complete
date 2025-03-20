import { createWriteStream } from "fs";
import { open, readdir, readFile, rename, rm } from "fs/promises";
import http from "http";
import mime from "mime-types";
import { json } from "stream/consumers";

const server = http.createServer(async (req, res) => {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "GET") {
    if (req.url === "/favicon.ico") return res.end("No favicon.");
    if (req.url === "/") {
      serveDirectory(req, res);
    } else {
      try {
        const [url, queryString] = req.url.split("?");
        const queryParam = {};
        queryString?.split("&").forEach((pair) => {
          const [key, value] = pair.split("=");
          queryParam[key] = value;
        });

        const fileHandle = await open(`./storage${decodeURIComponent(url)}`);
        const stats = await fileHandle.stat();
        if (stats.isDirectory()) {
          serveDirectory(req, res);
        } else {
          const readStream = fileHandle.createReadStream();
          res.setHeader("Content-Type", mime.contentType(url.slice(1)));
          res.setHeader("Content-Length", stats.size);
          if (queryParam.action === "download") {
            res.setHeader(
              "Content-Disposition",
              `attachment; filename="${url.slice(1)}"`
            );
          }
          readStream.pipe(res);
        }
      } catch (err) {
        console.log(err.message);
        res.end("Not Found!");
      }
    }
  } else if (req.method === "OPTIONS") {
    res.end("OK");
  } else if (req.method === "POST") {
    const writeStream = createWriteStream(`./storage/${req.headers.filename}`);
    let count = 0;
    req.on("data", (chunk) => {
      count++;
      writeStream.write(chunk);
    });

    req.on("end", () => {
      console.log(count);
      res.end("File uploaded on the server");
    });
  } else if (req.method === "DELETE") {
    req.on("data", async (chunk) => {
      try {
        const filename = chunk.toString();
        await rm(`./storage/${filename}`);
        res.end("File Deleted Sucessfully!");
      } catch (err) {
        res.end(err.message);
      }
    });
  } else if (req.method === "PATCH") {
    req.on("data", (chunk) => {
      const data = JSON.parse(chunk.toString());
      rename(`./storage/${data.oldName}`, `./storage/${data.fileName}`);
      res.end(
        `Renamed Sucessfully OldName:${data.oldName} ::: NewName : ${data.fileName}`
      );
    });
  }
});

async function serveDirectory(req, res) {
  const [url] = req.url.split("?");
  const itemsList = await readdir(`./storage${url}`);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(itemsList));
}

server.listen(80, "::", () => {
  console.log("Server started");
});
