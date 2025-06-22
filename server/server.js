const express = require('express');
const multer = require('multer');
const fs = require('fs-extra');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

const baseFolder = path.join(__dirname, 'workspace');
fs.ensureDirSync(baseFolder);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, baseFolder),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.post('/upload', upload.array('files'), (req, res) => {
  res.send({ message: 'Files uploaded successfully' });
});

app.get('/files', (req, res) => {
  const files = fs.readdirSync(baseFolder);
  res.send({ files });
});

app.post('/ai-edit', async (req, res) => {
  const { fileName, instruction } = req.body;
  const filePath = path.join(baseFolder, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  const content = await fs.readFile(filePath, 'utf-8');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
Edit the following file based on this instruction: "${instruction}"

File name: ${fileName}
File content:
${content}
Return only the new file content (no explanation).
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const updatedText = response.text().trim();

    await fs.writeFile(filePath, updatedText, 'utf-8');
    res.json({ message: 'File edited successfully by Gemini AI.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gemini API error', detail: err.message });
  }
});

app.post('/create', async (req, res) => {
  const { fileName, content } = req.body;
  const filePath = path.join(baseFolder, fileName);

  if (fs.existsSync(filePath)) {
    return res.status(400).send({ error: 'File already exists' });
  }

  try {
    await fs.outputFile(filePath, content || '');
    return res.send({ message: 'File created successfully' });
  } catch (err) {
    return res.status(500).send({ error: 'Failed to create file', details: err.message });
  }
});

app.post('/edit', async (req, res) => {
  const { fileName, prompt } = req.body;
  const filePath = path.join(baseFolder, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send({ error: 'File not found' });
  }

  let content = await fs.readFile(filePath, 'utf-8');

  const replaceMatch = prompt.match(/replace '(.*?)' with '(.*?)'/i);
  const addMatch = prompt.match(/add '(.*?)'(?: at (start|end))/i);
  const deleteMatch = prompt.match(/delete '(.*?)'/i);

  if (replaceMatch) {
    const [_, search, replace] = replaceMatch;
    content = content.split(search).join(replace);
  } else if (addMatch) {
    const [_, text, position] = addMatch;
    content = position === 'start' ? `${text}\n${content}` : `${content}\n${text}`;
  } else if (deleteMatch) {
    const [_, toDelete] = deleteMatch;
    content = content.split(toDelete).join('');
  } else {
    return res.status(400).send({ error: 'Unsupported prompt format' });
  }

  await fs.writeFile(filePath, content, 'utf-8');
  res.send({ message: 'File edited successfully' });
});

app.delete('/delete', async (req, res) => {
  const { fileName } = req.body;
  const filePath = path.join(baseFolder, fileName);

  if (fs.existsSync(filePath)) {
    await fs.remove(filePath);
    return res.send({ message: 'File deleted successfully' });
  }

  res.status(404).send({ error: 'File not found' });
});

app.get('/download/:fileName', (req, res) => {
  const filePath = path.join(baseFolder, req.params.fileName);
  if (fs.existsSync(filePath)) {
    return res.download(filePath);
  }
  res.status(404).send({ error: 'File not found' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`MCP server running on port ${PORT}`);
});
