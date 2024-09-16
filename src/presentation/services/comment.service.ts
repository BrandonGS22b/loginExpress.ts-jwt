import { CommentModel } from '../../mongo/models/comment.model';
import CommentDto  from '../../auth/comment.dto'; // Asegúrate de crear este DTO

class CommentService {

  public async createComment(commentDto: CommentDto) {
    try {
      const comment = new CommentModel(commentDto);
      await comment.save();
      return comment;
    } catch (error) {
      throw new Error(`Error creating comment`);
    }
  }

  public async getCommentsByReportId(reportId: string) {
    try {
      const comments = await CommentModel.find({ reportId });
      return comments;
    } catch (error) {
      throw new Error(`Error fetching comments`);
    }
  }

  public async deleteComment(commentId: string) {
    try {
      const result = await CommentModel.findByIdAndDelete(commentId);
      if (!result) throw new Error('Comment not found');
      return result;
    } catch (error) {
      throw new Error(`Error deleting comment`);
    }
  }
}

export default CommentService;