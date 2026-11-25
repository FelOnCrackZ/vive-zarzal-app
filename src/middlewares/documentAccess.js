import { UserDocument } from '../db/models/index.js';

const httpError = (status, message) =>
  Object.assign(new Error(message), { status });

const isAdmin = (user) => user.roles?.some((role) => role.slug === 'admin');

export const loadDocument =
  ({ allowAdmin = false } = {}) =>
  async (req, res, next) => {
    if (!/^\d+$/.test(req.params.id)) {
      throw httpError(404, 'El documento no existe.');
    }

    const document = await UserDocument.findByPk(req.params.id);
    if (!document) {
      throw httpError(404, 'El documento no existe.');
    }

    const isOwner = document.userId === req.currentUser.id;
    if (!isOwner && !(allowAdmin && isAdmin(req.currentUser))) {
      throw httpError(403, 'No tienes permiso para acceder a este documento.');
    }

    req.document = document;
    return next();
  };