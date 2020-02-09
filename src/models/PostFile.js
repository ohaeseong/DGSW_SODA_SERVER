module.exports = (sequelize, DataTypes) => {
  const PostFile = sequelize.define('PostFile', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    /** 게시물 idx */
    postIdx: {
      field: 'postIdx',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    /** 파일 TYPE */
    type: {
      field: 'type',
      type: DataTypes.TEXT,
      allowNull: false,
    },
    /** 파일 업로드 이름 */
    uploadName: {
      field: 'upload_name',
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tablename: 'PostFile',
    timestamps: false,
  });

  PostFile.associate = (models) => {
    PostFile.belongsTo(models.Post, {
      foreignKey: 'postIdx',
      onDelete: 'CASCADE',
    });
  };

  PostFile.getFiles = (idx) => PostFile.findAll({
    where: {
      postIdx: idx,
    },

    raw: true,
  });

  return PostFile;
};
