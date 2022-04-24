import request from '@/utils/request'

export function dataAccountRequest(data) {
  console.log("data", data, "data")
  return request({
    url: '/api/accountQuery',
    method: 'post',
    data
  })
}

export function dataMRequest(data) {
  return request({
    url: '/api/MQuery',
    method: 'post',
    data
  })
}
