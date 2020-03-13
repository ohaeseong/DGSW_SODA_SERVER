module.exports = (sequelize, DataTypes) => {
  const SodaFile = sequelize.define('SodaFile', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    /** 게시물 idx */
    sodaIdx: {
      field: 'soda_idx',
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
    tablename: 'SodaFile',
    timestamps: false,
  });

  SodaFile.associate = (models) => {
    SodaFile.belongsTo(models.SodaPost, {
      foreignKey: 'sodaIdx',
      onDelete: 'CASCADE',
    });
  };

  SodaFile.getFiles = (idx) => SodaFile.findAll({
    where: {
      sodaIdx: idx,
    },

    raw: true,
  });

  return SodaFile;
};
