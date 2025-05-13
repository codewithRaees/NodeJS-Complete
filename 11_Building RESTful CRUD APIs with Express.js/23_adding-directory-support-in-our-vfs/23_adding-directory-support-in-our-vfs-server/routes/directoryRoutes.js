import express from "express";
import { mkdir, readdir, stat } from "fs/promises";
import path from "path";
import directoriesDBData from "../directoriesDB.json" assert {type:"json"};
import filesDBData from "../fileDB.json" assert {type:"json"};
const router = express.Router();

// Read
router.get("/:id?", async (req, res) => {
  const { id } = req.params;
  
  
  if(!id){
   const directoryData = directoriesDBData[0]
    const files = directoryData.files.map((fileId) =>  
     filesDBData.find((file) => file.id === fileId) 
    )
   
    res.json({...directoryData, files});

  } else {
    
     const directoryData = directoriesDBData.find((directory) => directory.id === id)
    const files = directoryData.files.map((fileId) =>  
     filesDBData.find((file) => file.id === fileId) 
    )
    res.json({...directoryData, files});
  }
 
  
});

router.post("/*", async (req, res) => {
  const dirname = path.join("/", req.params[0]);
  try {
    await mkdir(`./storage/${dirname}`);
    res.json({ message: "Directory Created!" });
  } catch (err) {
    res.json({ err: err.message });
  }
});

export default router;
