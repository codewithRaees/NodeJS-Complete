import express from "express";
import { createWriteStream } from "fs";
import { readdir, rename, rm } from "fs/promises";

const app = express();

app.use(express.json());

//Enabling CORS
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', "*")
  res.set('Access-Control-Allow-Methods', '*')
  res.set('Access-Control-Allow-Headers', '*')
  next()
})

app.post('/:filename', (req, res) => {
  const writeStream = createWriteStream(`./storage/${req.params.filename}`);
  req.pipe(writeStream)
  req.on('end', () => {
    res.end('File uploaded on the server')
  })
})
//READ
app.get('/', async (req, res) => {
 const filesList = await readdir('./storage')
 res.json(filesList)
})
app.get('/:filename', (req, res) => {
  const { filename } = req.params 
  if (req.query.action === 'download') {
    res.set('Content-Disposition', 'attachment')
  }
  res.sendFile(`${import.meta.dirname}/storage/${filename}`)
})


// Delete
app.delete('/:filename', async (req, res) => {
  const { filename } = req.params
  const filePath = `./storage/${filename}`
  console.log(filePath)
  try {
    rm(filePath)
    res.json({ message: 'File Deleted Successfully' })
  } catch (err) {
   res.status(404).json({ message: 'File Not Found!' }) 
  }
  
})

// RENAME
app.patch('/:filename', async (req, res) => {
  const { filename } = req.params
  const newFilename = req.body.newFilename
  const filePath = `./storage/${filename}`
  const newFilePath = `./storage/${newFilename}`
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
