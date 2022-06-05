import request from '@/utils/request'

export function searchLine(data) {
  return request({
    url: '/api/curve/showCurves',
    method: 'post',
    data
  })
}

export function addLine(data) {
  return request({
    url: '/api/curve/addCurve',
    method: 'post',
    data
  })
}

export function alterLine(data) {
  return request({
    url: '/api/curve/alterCurve',
    method: 'post',
    data
  })
}

export function deleteLine(data) {
  return request({
    url: '/api/curve/deleteCurve',
    method: 'post',
    data
  })
}
