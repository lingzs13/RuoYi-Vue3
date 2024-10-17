import request from '@/utils/request'

// 查询租赁管理列表
export function listRecord(query) {
  return request({
    url: '/code/record/list',
    method: 'get',
    params: query
  })
}

// 查询租赁管理详细
export function getRecord(id) {
  return request({
    url: '/code/record/' + id,
    method: 'get'
  })
}

// 新增租赁管理
export function addRecord(data) {
  return request({
    url: '/code/record',
    method: 'post',
    data: data
  })
}

// 修改租赁管理
export function updateRecord(data) {
  return request({
    url: '/code/record',
    method: 'put',
    data: data
  })
}

// 删除租赁管理
export function delRecord(id) {
  return request({
    url: '/code/record/' + id,
    method: 'delete'
  })
}
