import request from '@/utils/request'

export function searchStation(data) {
  return request({
    url: '/api/station/showStations',
    method: 'post',
    data
  })
}

export function addStation(data) {
  return request({
    url: '/api/station/addStation',
    method: 'post',
    data
  })
}

export function alterStation(data) {
  return request({
    url: '/api/station/alterStation',
    method: 'post',
    data
  })
}

export function deleteStation(data) {
  return request({
    url: '/api/station/deleteStation',
    method: 'post',
    data
  })
}
