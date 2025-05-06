import express from "express";
import { createWriteStream } from "fs";
import { readdir, rename, rm, stat } from "fs/promises";
import cors from 'cors'

const app = express();

app.use(express.json());
// USING CORS LIBRARY for CORS PERMISSIONS
app.use(cors())

//READ
app.get('/directory/:dirname?', async (req, res) => {
  const { dirname } = req.params
  console.log(dirname)
  const fullDirPath = `${import.meta.dirname}/storage/${dirname? dirname : ''}`
  const filesList = await readdir(fullDirPath)
  const resData = []
   for (const item of filesList) {
      const stats = await stat(`${fullDirPath}/${item}`)
      resData.push({
        name: item,
        isDirectory: stats.isDirectory(),
        
      })
    }
  console.log(resData)
 res.json(resData)
})

app.post('/files/:filename', (req, res) => {
  const writeStream = createWriteStream(`./storage/${req.params.filename}`);
  req.pipe(writeStream)
  req.on('end', () => {
    res.end('File uploaded on the server')
  })
})

app.get('/files/:filename', (req, res) => {
  const { filename } = req.params 
  if (req.query.action === 'download') {
    res.set('Content-Disposition', 'attachment')
  }
  res.sendFile(`${import.meta.dirname}/storage/${filename}`)
})


// Delete
app.delete('/files/:filename', async (req, res) => {
  const { filename } = req.params
  const filePath = `${import.meta.dirname}/storage/${filename}`
  console.log(filePath)
  try {
    rm(filePath)
    res.json({ message: 'File Deleted Successfully' })
  } catch (err) {
   res.status(404).json({ message: 'File Not Found!' }) 
  }
  
})

// RENAME
app.patch('/files/:filename', async (req, res) => {
  const { filename } = req.params
  const newFilename = req.body.newFilename
  const filePath = `${import.meta.dirname}/storage/${filename}`
  const newFilePath = `${import.meta.dirname}/storage/${newFilename}`
  try {
    await rename(filePath, newFilePath)
    res.json({ message: 'Renamed Successfully' })
  } catch (err) {
    res.status(404).json({ message: 'File Not Found!' })
  }
})

// // Update
// app.patch("/:filename", async (req, res) => {
//   const { filename } = req.params;
//   await rename(`./storage/${filename}`, `./storage/${req.body.newFilename}`);
//   res.json({ message: "Renamed" });
// });



app.listen(4000, () => {
  console.log(`Server Started`);
});
