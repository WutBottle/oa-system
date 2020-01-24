const getters = {
  token: state => state.userOperation.token,
  role: state => state.userOperation.role,
  addRouters: state => state.permission.addRouters,
};

export default getters