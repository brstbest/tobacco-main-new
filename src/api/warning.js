import request from '@/utils/request'

export function searchWarning(data) {
  return request({
    url: '/api/bake/findDetailWarnings',
    method: 'post',
    data
  })
}

export function alterWarning(data) {
  return request({
    url: '/api/bake/alterWarning',
    method: 'post',
    data
  })
}