module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
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
    /** 해결 여부 알려주는 컬럼 */
    isComplate: {
      field: 'is_complate',
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: 0,
    },
    /** 업로드 날짜 */
    joinDate: {
      field: 'join_date',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tablename: 'Question',
    timestamps: false,
  });

  Question.associate = (models) => {
    Question.belongsTo(models.Member, {
      foreignKey: 'memberId',
      onDelete: 'CASCADE',
    });
  };

  Question.getQuestionForConfirm = (memberId, idx) => Question.findOne({
    where: {
      memberId,
      idx,
    },

    raw: true,
  });

  Question.getByIdx = (idx) => Question.findOne({
    where: {
      idx,
    },

    raw: true,
  });

  Question.deleteQuestion = (idx) => Question.destroy({
    where: {
      idx,
    },
  });

  Question.getAllQuestion = (requestPage, limit) => Question.findAll({
    offset: requestPage,
    limit,
    order: [
      ['joinDate', 'DESC'],
    ],

    raw: true,
  });

  Question.getMyQuestion = (memberId, requestPage, limit) => Question.findAll({
    offset: requestPage,
    limit,
    where: {
      memberId,
    },

    order: [
      ['joinDate', 'DESC'],
    ],

    raw: true,
  });

  Question.getIsComplateQuestion = (isComplate, requestPage, limit) => {
    if (isComplate === 1) {
      return Question.findAll({
        offset: requestPage,
        limit,
        where: {
          isComplate,
        },

        order: [
          ['joinDate', 'DESC'],
        ],

        raw: true,
      });
    }

    if (isComplate === 0) {
      return Question.findAll({
        offset: requestPage,
        limit,
        where: {
          isComplate,
        },

        order: [
          ['joinDate', 'DESC'],
        ],

        raw: true,
      });
    }
  };


  return Question;
};
