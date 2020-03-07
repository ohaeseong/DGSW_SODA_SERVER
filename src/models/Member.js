module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    memberId: {
      field: 'member_id',
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
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
    profileImage: {
      field: 'profile_image',
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    auth: {
      field: 'auth',
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    joinDate: {
      field: 'join_date',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updateDate: {
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
    attributes: ['memberId', 'certification', 'auth', 'displayName', 'joinDate', 'updateDate', 'profileImage'],
    where: {
      memberId: id,
      pw,
    },

    raw: true,
  });

  Member.registerMember = (memberId, pw, auth, name, certification, profileImage) => Member.create({
    memberId,
    pw,
    displayName: name,
    auth,
    profileImage,
    certification,
  });

  Member.findRegisterMemberId = (memberId) => Member.findOne({
    where: {
      memberId,
    },
    raw: true,
  });

  return Member;
};
