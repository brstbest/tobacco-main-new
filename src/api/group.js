import request from '@/utils/request'

export function searchGroup(data) {
  return request({
    url: '/api/deviceGroup/showDeviceGroups',
    method: 'post',
    data
  })
}

export function addGroup(data) {
  return request({
    url: '/api/deviceGroup/addDeviceGroup',
    method: 'post',
    data
  })
}

export function alterGroup(data) {
  return request({
    url: '/api/deviceGroup/alterDeviceGroup',
    method: 'post',
    data
  })
}

export function deleteGroup(data) {
  return request({
    url: '/api/deviceGroup/deleteDeviceGroup',
    method: 'post',
    data
  })
}