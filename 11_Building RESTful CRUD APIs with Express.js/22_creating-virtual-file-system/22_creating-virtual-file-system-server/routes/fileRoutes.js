import express from "express";
import { createWriteStream } from "fs";
import { rename, rm, writeFile } from "fs/promises";
import path from "path";
import fileDB from "../fileDB.json" assert {type:"json"};
const router = express.Router();
 
// Create
router.post("/:filename", (req, res) =>  {
 
  const { filename } = req.params
  const fileextension = path.extname(filename)
  const id = crypto.randomUUID()
  const FullFilename = `${id}${fileextension}`
  const writeStream = createWriteStream(`./storage/${FullFilename}`);
  req.pipe(writeStream);
  req.on("end",  async() => {
    fileDB.push(
      {
        id:id,
        extension: fileextension,
        name: filename
      });
    
    await writeFile('./fileDB.json', JSON.stringify(fileDB))
    res.json({ message: "File Uploaded" });
  });
});

// Path Traversal Vulnerability
router.get("/:id", (req, res) => {
  const { id } = req.params
  const fileData = fileDB.find((file) => file.id === id);
  const filepath = `${fileData.id}${fileData.extension}`
  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }
  res.sendFile(`${process.cwd()}/storage/${filepath}`, (err) => {
    if (err) {
      res.json({ error: "File not found!" });
    }
  });
});

// Update
router.patch("/*", async (req, res) => {
  const { 0: filePath } = req.params;
  await rename(`./storage/${filePath}`, `./storage/${req.body.newFilename}`);
  res.json({ message: "Renamed" });
});

// Delete
router.delete("/*", async (req, res) => {
  const { 0: filePath } = req.params;
  try {
    await rm(`./storage/${filePath}`, { recursive: true });
    res.json({ message: "File Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

export default router;
