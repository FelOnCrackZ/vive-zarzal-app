import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { loadDocument } from '../middlewares/documentAccess.js';
import { uploadSupport } from '../middlewares/uploadSupport.js';
import {
  saveDocumentSupport,
  downloadDocumentSupport,
  deleteDocument,
} from '../controllers/documentController.js';

export const documentRouter = Router();

documentRouter.post(
  '/documents/:id/support',
  requireAuth,
  loadDocument(),
  uploadSupport,
  saveDocumentSupport,
);
documentRouter.get(
  '/documents/:id/support',
  requireAuth,
  loadDocument({ allowAdmin: true }),
  downloadDocumentSupport,
);
documentRouter.post(
  '/documents/:id/delete',
  requireAuth,
  loadDocument(),
  deleteDocument,
);