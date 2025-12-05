import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import path from 'path';

export const uploadFile = async (req: AuthRequest, res: Response) => {
  try {
    console.log('Upload request received');
    console.log('Request file:', req.file);
    console.log('Request body:', req.body);
    
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get the file path
    const fileUrl = `/uploads/${req.file.filename}`;
    
    console.log('File uploaded successfully:', fileUrl);
    
    res.status(200).json({
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message || 'Failed to upload file' });
  }
};
