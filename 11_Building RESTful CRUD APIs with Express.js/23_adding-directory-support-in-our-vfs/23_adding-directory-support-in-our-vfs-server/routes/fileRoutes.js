import express from "express";
import { createWriteStream } from "fs";
import { rename, rm, writeFile } from "fs/promises";
import path from "path";
import fileDB from "../fileDB.json" assert {type: "json"};
import directoriesDBData from "../directoriesDB.json" assert {type:"json"};
const router = express.Router();
 
// Create
router.post("/:filename", (req, res) =>  {
  const { filename } = req.params
  const fileExtension = path.extname(filename)
  const parentDirId = req.headers.parentdirid || directoriesDBData[0].id
  const id = crypto.randomUUID()
  const FullFilename = `${id}${fileExtension}`
  const writeStream = createWriteStream(`./storage/${FullFilename}`);
  req.pipe(writeStream);
  req.on("end",  async() => {
    fileDB.push(
      {
        id:id,
        extension: fileExtension,
        name: filename,
        parentDirId: parentDirId 
      
      });
    const parentDirData = directoriesDBData.find((directoryData) => directoryData.id === parentDirId) 
    parentDirData.files.push(id)
    await writeFile('./fileDB.json', JSON.stringify(fileDB))
    await writeFile('./directoriesDB.json', JSON.stringify(directoriesDBData))
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
router.patch("/:id", async (req, res) => {
  const { id } = req.params
  const fileData = fileDB.find((file) => file.id === id)
  fileData.name = req.body.newFilename
  await writeFile('./fileDB.json', JSON.stringify(fileDB))
  console.log(fileDB)
  res.json({ message: "Renamed" });
});
console.log(directoriesDBData)
// Delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params
     const fileIndex = fileDB.findIndex((file) => file.id === id)
     const fileData = fileDB[fileIndex]
     const parentDirData =directoriesDBData.find((directoryData) => directoryData.id === fileData.parentDirId)
      parentDirData.files = parentDirData.files.filter((fileId) => fileId !== id)
  
  try {
    await rm(`./storage/${fileData.id}${fileData.extension}`)
    fileDB.splice(fileIndex, 1)
    await writeFile('./fileDB.json', JSON.stringify(fileDB))
   await writeFile('./directoriesDB.json', JSON.stringify(directoriesDBData))
    res.json({ message: "File Deleted Successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

export default router;
