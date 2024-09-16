import { Request, Response } from 'express';
import CommentService from '../../services/comment.service';

class CommentController {
  constructor(
    private readonly commentService: CommentService,
  ) {}

  // Crear un comentario
  public createComment = async (req: Request, res: Response) => {
    const commentDto = req.body;
    const comment = await this.commentService.createComment(commentDto);
    return res.status(201).json(comment);
  };

  // Obtener comentarios por ID de reporte
  public getCommentsByReportId = async (req: Request, res: Response) => {
    const { reportId } = req.params;
    const comments = await this.commentService.getCommentsByReportId(reportId);
    return res.status(200).json(comments);
  };

  // Eliminar un comentario por ID
  public deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const result = await this.commentService.deleteComment(commentId);
    return res.status(200).json(result);
  };
}

export default CommentController;
