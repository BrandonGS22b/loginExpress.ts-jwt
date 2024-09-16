class CommentDto {
    userId!: string;
    reportId!: string;
    comment!: string;
  
    constructor(userId: string, reportId: string, comment: string) {
      this.userId = userId;
      this.reportId = reportId;
      this.comment = comment;
    }
  
    static create(data: Partial<CommentDto>): [Error | null, CommentDto | null] {
      const { userId, reportId, comment } = data;
      if (!userId || !reportId || !comment) {
        return [new Error('Missing required fields'), null];
      }
      return [null, new CommentDto(userId, reportId, comment)];
    }
  }

  export default CommentDto;