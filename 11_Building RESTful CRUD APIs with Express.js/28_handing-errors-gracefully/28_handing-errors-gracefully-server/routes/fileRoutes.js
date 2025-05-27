import express from "express";
import { createWriteStream } from "fs";
import { rename, rm, writeFile } from "fs/promises";
import path from "path";
import directoriesData from '../directoriesDB.json' with {type: "json"}
import filesData from '../filesDB.json' with {type: "json"}
import { error } from "console";


const router = express.Router();

// Create
router.post("/:parentDirId?", (req, res) => {
  const parentDirId = req.params.parentDirId || directoriesData[0].id
  const filename = req.headers.filename
  const id = crypto.randomUUID();
  const extension = path.extname(filename);
  const fullFileName = `${id}${extension}`;
  const writeStream = createWriteStream(`./storage/${fullFileName}`);
  req.pipe(writeStream);
  req.on("end", async () => {
    filesData.push({
      id,
      extension,
      name: filename,
      parentDirId,
    })
    const parentDirData = directoriesData.find((directoryData) => directoryData.id === parentDirId)
    parentDirData.files.push(id)
    try {
      await writeFile('./filesDB.json', JSON.stringify(filesData))
    await writeFile('./directoriesDB.json', JSON.stringify(directoriesData))
    return res.status(201).json({ message: "File Uploaded" });
    }catch (err) {
      return res.status(500).json({ message: "Could not save file " });
    }
  });
});

// Read
router.get("/:id", (req, res) => {
  const {id} = req.params
  const fileData = filesData.find((file) => file.id === id)
  if(!fileData) return res.status(404).json({ message: "File not found!" })
  if (req.query.action === "download") {
    res.set("Content-Disposition", `attachment; filename=${fileData.name}`);
  }
  res.sendFile(`${process.cwd()}/storage/${id}${fileData.extension}`, (err) => {
    
    if (!res.headersSent || err) {
      return res.status(404).json({ error: "File not found!" });
    }
  });
});

// Update
router.patch("/:id", async (req, res, next) => {
  const {id} = req.params;
  const fileData = filesData.find((file) => file.id === id)
  fileData.name = req.body.newFilename
  try {
    
    await writeFile('./filesDB.json', JSON.stringify(filesData))
  return res.status(200).json({ message: "Renamed" });
  } catch (err) {
    err.status = 500
    next(err)
 }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  const {id} = req.params
  const fileIndex = filesData.findIndex((file) => file.id === id)
  if(fileIndex === -1) return res.status(404).json({ message: "File not found!" })  
  const fileData = filesData[fileIndex]
  try {
   
    await rm(`./storage/${id}${fileData.extension}`, { recursive: true });
    filesData.splice(fileIndex, 1)
    const parentDirData = directoriesData.find((directoryData) => directoryData.id === fileData.parentDirId)
    parentDirData.files = parentDirData.files.filter((fileId) => fileId !== id)
    console.log(parentDirData.files);
    await writeFile('./filesDB.json', JSON.stringify(filesData))
    await writeFile('./directoriesDB.json', JSON.stringify(directoriesData))
    return res.status(200).json({ message: "File Deleted Successfully" });
  } catch (err) {
    next(err)
  }
});

export default router;
