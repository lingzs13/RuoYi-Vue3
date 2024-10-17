import request from '@/utils/request'

//租赁功能
export function updateLease(data) {
  return request({
    url: '/code/record/updateStatus',
    method: 'put',
    data: data
  })
}