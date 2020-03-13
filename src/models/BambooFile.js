module.exports = (sequelize, DataTypes) => {
  const BambooFile = sequelize.define('BambooFile', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    /** 게시물 idx */
    bambooIdx: {
      field: 'bamboo_idx',
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
    tablename: 'BambooFile',
    timestamps: false,
  });

  BambooFile.associate = (models) => {
    BambooFile.belongsTo(models.Bamboo, {
      foreignKey: 'bambooIdx',
      onDelete: 'CASCADE',
    });
  };

  BambooFile.getFiles = (idx) => BambooFile.findAll({
    where: {
      bambooIdx: idx,
    },

    raw: true,
  });

  BambooFile.deleteFile = (idx) => BambooFile.destroy({
    where: {
      bambooIdx: idx,
    },
  });

  return BambooFile;
};
