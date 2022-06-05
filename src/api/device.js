import request from '@/utils/request'

export function addDevice(data) {
  return request({
    url: '/api/device/addDevice',
    method: 'post',
    data
  })
}

export function searchDevice(data) {
  return request({
    url: '/api/device/showDevices',
    method: 'post',
    data
  })
}

export function alterDevice(data) {
  return request({
    url: '/api/device/alterDevice',
    method: 'post',
    data
  })
}

export function deleteDevice(data) {
  return request({
    url: '/api/device/deleteDevice',
    method: 'post',
    data
  })
}

export function searchBakingDevice(data) {
  return request({
    url: '/api/device/bakingDevice',
    method: 'post',
    data
  })
}
