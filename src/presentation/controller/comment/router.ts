import { Router } from 'express';
import CommentController from './commentcontroller';
import CommentService from '../../services/comment.service';

export class CommentRoutes {

  static get routes(): Router {
    const router = Router();
    const commentService = new CommentService();
    const controller = new CommentController(commentService);

    // Crear un comentario (sin autenticación)
    router.post('/create', controller.createComment);

    // Obtener comentarios por ID de reporte (sin autenticación)
    router.get('/report/:reportId', controller.getCommentsByReportId);

    // Eliminar un comentario por ID (sin autenticación)
    router.delete('/:commentId', controller.deleteComment);

    return router;
  }

}
