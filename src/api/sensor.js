import request from '@/utils/request'

export function getSensor(data) {
  return request({
    url: '/api/query/detailRoastedTobacco',
    method: 'post',
    data
  })
}