const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  user_id: state => state.user.user_id,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  nname: state => state.user.nname,
  category: state => state.user.category,
  phone: state => state.user.phone,
  permission_range: state => state.user.permission_range,
}
export default getters
