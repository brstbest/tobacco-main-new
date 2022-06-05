import request from '@/utils/request'

export function searchMalfunction(data) {
  return request({
    url: '/api/malfunction/showMalfunctions',
    method: 'post',
    data
  })
}

export function addMalfunction(data) {
  return request({
    url: '/api/malfunction/addMalfunction',
    method: 'post',
    data
  })
}

export function alterMalfunction(data) {
  return request({
    url: '/api/malfunction/alterMalfunction',
    method: 'post',
    data
  })
}

export function deleteMalfunction(data) {
  return request({
    url: '/api/malfunction/deleteMalfunction',
    method: 'post',
    data
  })
}