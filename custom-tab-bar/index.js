import {USER_PAGE} from "../config/common"
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    "list": []
  },
  lifetimes:{
    async attached() {
      const role = await this.fetchUserRole()
      console.log(role)
      this.setTabBar(role);
    },
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      // 注释掉官方demo的这段代码
      // this.setData({
      //   selected: data.index
      // })
    },
    async fetchUserRole() {
      try {
        const res = await wx.cloud.callFunction({
          name: 'getUserRole',  // 云函数名称
          data: {}  // 传递给云函数的参数（如需传递额外参数）
        });
        if (res.result.success) {
          return res.result.role;  // 返回用户角色，如 "admin" 或 "user"
        } else {
          console.error('获取用户角色失败:', res.result.message);
          return 'user';  // 默认返回普通用户权限
        }
      } catch (error) {
        console.error('云函数调用失败:', error);
        return 'user';  // 出错时默认返回普通用户权限
      }
    },
    setTabBar(userRole) {
      if(userRole === "user"){
        this.setData({
          list: USER_PAGE.memberTabbarList
        })
      }else if(userRole === "admin"){
        this.setData({
          list: USER_PAGE.adminTabbarList
        })
      }else{
        this.setData({
          list: USER_PAGE.memberTabbarList
        })
      }
    }
  }
})