import request from '@/utils/request'

export function getWeather(data) {
  return request({
    url: '/weather/v7/weather/now',
    method: 'get',
    params: data
  })
}

export function getLocationId(data) {
  return request({
    url: '/geo/v2/city/lookup',
    method: 'get',
    params: data
  })
}
