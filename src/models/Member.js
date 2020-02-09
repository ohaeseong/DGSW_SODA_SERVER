module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    email: {
      field: 'email',
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    certification: {
      field: 'certification_check',
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    pw: {
      field: 'pw',
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    displayName: {
      field: 'display_name',
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    auth: {
      field: 'auth',
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    joinData: {
      field: 'join_date',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updateData: {
      field: 'update_date',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tablename: 'member',
    timestamps: false,
  });

  Member.findMemberForLogin = (id, pw) => Member.findOne({
    attributes: ['email', 'certification', 'auth', 'displayName', 'join_date', 'update_date'],
    where: {
      email: id,
      pw,
    },

    raw: true,
  });

  Member.registerMember = (email, pw, auth, name, certification) => Member.create({
    email,
    pw,
    displayName: name,
    auth,
    certification,
  });

  Member.findRegisterMemberId = (email) => Member.findOne({
    where: {
      email,
    },
    raw: true,
  });

  return Member;
};
