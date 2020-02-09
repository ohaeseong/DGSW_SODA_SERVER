module.exports = (sequelize, DataTypes) => {
  const PostComment = sequelize.define('PostComment', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    /* foreign key - 분실물 게시물 idx */
    postIdx: {
      field: 'post_idx',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    /* 댓글 내용 */
    comment: {
      field: 'comment',
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    /* 댓글 작성자 memberId */
    memberId: {
      field: 'member_id',
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    /* 댓글 수정 여부 컬럼 */
    isUpdate: {
      field: 'is_update',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    /** 댓글 작성 날짜 */
    writeTime: {
      field: 'write_time',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'PostComment',
    timestamps: false,
  });

  const attributes = [
    'idx', 'memberId', 'comment', 'writeTime', 'postIdx', 'isUpdate',
  ];

  PostComment.associate = (models) => {
    PostComment.belongsTo(models.Post, {
      foreignKey: 'postIdx',
      onDelete: 'CASCADE',
    });
  };

  PostComment.getCommentsByPostIdx = (idx) => PostComment.findAll({
    where: {
      postIdx: idx,
    },

    raw: true,
  });

  PostComment.getCommentByIdx = (idx, memberId) => PostComment.findOne({
    where: {
      idx,
      memberId,
    },

    raw: true,
  });

  PostComment.getAllComment = () => PostComment.findAll({
    raw: true,
  });

  return PostComment;
};
