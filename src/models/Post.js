module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    /** 제목 */
    title: {
      field: 'title',
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    /** 내용 */
    contents: {
      field: 'contents',
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    /** 작성자 */
    memberId: {
      field: 'member_id',
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    /** 게시글 인증 */
    isAllow: {
      field: 'is_allow',
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: 0,
    },
    /** 카테고리 */
    category: {
      field: 'category',
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    /** 업로드 날짜 */
    joinData: {
      field: 'join_date',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    /** 게시물 승인 날짜 */
    allowDate: {
      field: 'allow_date',
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tablename: 'Post',
    timestamps: false,
  });

  Post.getByIdx = (idx) => Post.findOne({
    where: {
      idx,
    },
    raw: true,
  });

  Post.getisAllowPost = (isAllow) => Post.findAll({
    where: {
      isAllow,
    },

    raw: true,
  });

  return Post;
};
