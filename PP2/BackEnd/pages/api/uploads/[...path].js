import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  const { path: filePathArray } = req.query;
  const filePath = path.join(process.cwd(), 'backend/public/uploads', ...filePathArray);

  try {
    if (fs.existsSync(filePath)) {
      const file = fs.createReadStream(filePath);
      res.setHeader('Content-Type', 'image/jpeg');  // Adjust MIME type as needed
      return file.pipe(res);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error serving file', error: error.message });
  }
}
