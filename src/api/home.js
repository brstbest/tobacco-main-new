import request from '@/utils/request'
import qs from 'querystring'

export function dataMonitoringRequest(data) {
  // console.log("data", data, "data")
  return request({
    url: '/api/query/detailRoastedTobacco',
    method: 'post',
    data
  })
}

export function getMapDataTest(data) {

  return request({
    url: '/api/homePage/queryData?token=ecnueyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlY251IiwiaGVhZF9pbWciOiJodHRwczovL3hkLXZpZGVvLXBjLWltZy5vc3MtY24tYmVpamluZy5hbGl5dW5jcy5jb20veGRjbGFzc19wcm8vZGVmYXVsdC9oZWFkX2ltZy8xNC5qcGVnIiwiaWQiOiJrNDN6eCIsIm5uYW1lIjoiMTI0MzMiLCJwaG9uZSI6IjE5ODIxNDMxODc1MzciLCJpYXQiOjE2NDk0OTYyMjcsImV4cCI6MTY1MDEwMTAyN30.xAhqDO9dwzq9p7f7SqvRSSF0r_dR-tw9_16hWehtyqY&startTime=1231&endTime=12312',
    method: 'post',
    params: { token: data.token, startTime: data.startTime, endTime: data.endTime }
  })
}

export function getMapData(data) {
  return request({
    headers: {
      "Content-Type": "application/json"
    },
    url: '/api/homePage/queryData',
    method: 'post',
    data
  })
}

// export const getMapData = (params) => request.post(`/api/homePage/queryData?token=ecnueyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlY251IiwiaWQiOiJhZG1pbjEyMyIsIm5uYW1lIjoic2FuIiwicGhvbmUiOiIxMjM0NTY3ODkxMCIsImlhdCI6MTY0OTU5NjgxMSwiZXhwIjoxNjUwMjAxNjExfQ.ONbhtwUp8jGyBpOk8aN41OyjgPccq--0VYThPWXkA0w&startTime=1231&endTime=12312`, params)
// export const getMapDataTest = (params) => request.post(`/api/homePage/queryData`, params)
// export const getMapData = (params) => request.post(`/api/homePage/queryData`, params)
