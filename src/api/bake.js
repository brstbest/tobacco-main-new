import request from '@/utils/request'

export function getBakeData(query) {
  return request({
    url: '/api/bake/list',
    method: 'get',
    params: query
  })
}

// export function getOtherData(query) {
//   return request({
//     url: '/api/bake/other',
//     method: 'get',
//     params: query
//   })
// }

export function getOtherData(data) {
  return request({
    url: '/api/bake/alertData',
    method: 'post',
    data
  })
}

export function getAlertData(data) {
  return request({
    url: '/api/bake/alertData',
    method: 'post',
    data
  })
}

export function getBakeRecord(data) {
  return request({
    url: '/api/bake/findBakingRecordsByOptions',
    method: 'post',
    data
  })
}

export function addBakeRecord(data) {
  return request({
    url: '/api/bake/addBakingRecord',
    method: 'post',
    data
  })
}

export function alterBakeRecord(data) {
  return request({
    url: '/api/bake/alterBakingRecord',
    method: 'post',
    data
  })
}

export function deleteBakeRecord(data) {
  return request({
    url: '/api/bake/deleteBakingRecord',
    method: 'post',
    data
  })
}

export function getBakeFigure(data) {
  return request({
    url: '/api/bake/findBakingFiguresByOptions',
    method: 'post',
    data
  })
}
