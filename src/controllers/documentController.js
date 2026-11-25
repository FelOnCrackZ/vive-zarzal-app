import fs from 'node:fs/promises';
import path from 'node:path';
import { SUPPORTS_DIR } from '../middlewares/uploadSupport.js';

const httpError = (status, message) =>
  Object.assign(new Error(message), { status });

// Solo se guarda el nombre del archivo; basename evita salirse de la carpeta.
const supportFilePath = (fileName) =>
  path.join(SUPPORTS_DIR, path.basename(fileName));

const removeSupportFile = async (fileName) => {
  if (!fileName) return;
  try {
    await fs.unlink(supportFilePath(fileName));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
};

export const saveDocumentSupport = async (req, res) => {
  if (!req.file) {
    throw httpError(400, 'Debes adjuntar un soporte en PDF, JPG o PNG.');
  }

  const { document } = req;
  const previousFile = document.supportPath;

  try {
    await document.update({ supportPath: req.file.filename });
  } catch (error) {
    await removeSupportFile(req.file.filename);
    throw error;
  }

  await removeSupportFile(previousFile);

  return res.redirect(
    `/profile/edit?success=${encodeURIComponent('Soporte cargado correctamente.')}`,
  );
};

export const downloadDocumentSupport = async (req, res) => {
  const { document } = req;
  if (!document.supportPath) {
    throw httpError(404, 'Este documento no tiene soporte.');
  }

  const filePath = supportFilePath(document.supportPath);
  try {
    await fs.access(filePath);
  } catch {
    throw httpError(404, 'El archivo de soporte no se encuentra.');
  }

  return res.sendFile(filePath, {
    headers: {
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};

export const deleteDocument = async (req, res) => {
  const { document } = req;
  const fileName = document.supportPath;

  await document.destroy();
  await removeSupportFile(fileName).catch((error) => console.error(error));

  return res.redirect(
    `/profile/edit?success=${encodeURIComponent('Documento eliminado.')}`,
  );
};