module.exports = (sequelize, DataTypes) => {
  const SodaPostLike = sequelize.define('SodaPostLike', {
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
    /** 멤버 이름 */
    memberId: {
      field: 'member_id',
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    /** 좋아요를 눌렀는지 확인 하는 컬럼 */
    isLike: {
      field: 'is_like',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tablename: 'SodaPostLike',
    timestamps: false,
  });

  SodaPostLike.associate = (models) => {
    SodaPostLike.belongsTo(models.SodaPost, {
      foreignKey: 'sodaIdx',
      onDelete: 'CASCADE',
    });

    SodaPostLike.belongsTo(models.Member, {
      foreignKey: 'memberId',
      onDelete: 'CASCADE',
    });
  };

  SodaPostLike.getPostLike = (idx, memberId) => SodaPostLike.findOne({
    where: {
      sodaIdx: idx,
      memberId,
    },

    raw: true,
  });

  SodaPostLike.createPostLike = (idx, memberId, isLike) => SodaPostLike.create({
    sodaIdx: idx,
    memberId,
    isLike,
  });

  SodaPostLike.getPostLikes = (idx) => SodaPostLike.findAll({
    where: {
      sodaIdx: idx,
    },

    raw: true,
  });

  return SodaPostLike;
};
