// components/menu/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type:String
    },
    list: {
      type: Array,   //  在此定义的是组件对外要开发的属性
      observer: function(newVal) {
        // 每次 list 变化时重置选中状态
        if (newVal && newVal.length > 0) {
          this.setData({
            actived: newVal[0]
          });
          this.triggerEvent("choose", {
            name: this.properties.name,
            id: this.data.actived
          });
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    actived: {
      type:String
    }   //data里定义的是在组件里自己使用的私有的数据
  },
  lifetimes:{
    attached: function(e) {
      this.setData({
        actived: this.data.list[0]
      })
      this.triggerEvent("choose", { 
        name: this.properties.name, 
        id: this.data.actived 
      })
    }
  },
  //组件初始化完成，触发attached， 默认选中第一个选项

  /**
   * 组件的方法列表
   */
  methods: {
    changetype(e) {
      console.log(e.currentTarget.dataset.id)
      this.setData({
        actived: e.currentTarget.dataset.id
      })
      this.triggerEvent("choose", { 
        name: this.properties.name, 
        id: e.currentTarget.dataset.id 
      })
    }
  }
})