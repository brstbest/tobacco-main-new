const Mock = require('mockjs')

module.exports = [
  {
    url: '/api/accountQuery',
    type: 'post',
    response: config => {
      const data = Mock.mock(
        [
          {'id': '111', 'account': '12341110293', 'name': '张三', 'mail': '123456@qq.com', 'createDate': '2022-1-1', 'login': '无', 'lastDate': '2022-1-1', 'state': true},
          {'id': '112', 'account': '13211110293', 'name': '李四', 'mail': '123116@qq.com', 'createDate': '2022-1-1', 'login': '无', 'lastDate': '2022-1-1', 'state': false}
        ]
      )
      return {
        code: 20000,
        data: data
      }
    }
  },
  {
    url: '/api/MQuery',
    type: 'post',
    response: config => {
      const data = Mock.mock(
        [
          {'areacode': '111', 'areaname': 'XXXXXX', 'principle': '张三', 'contact': '123456@qq.com', 'device_num': '33', 'areascore': '90'},
          {'areacode': '111', 'areaname': 'XXXXXX', 'principle': '张三', 'contact': '123456@qq.com', 'device_num': '33', 'areascore': '90'},
        ]
      )
      return {
        code: 20000,
        data: data
      }
    }
  },
  
]
