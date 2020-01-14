import axios from './base'

function get_data(query) {
    let page = query.page || 1
    let id = query.id || 'all'
    let department = query.department || 'all'
    let gt_time = query.gt_time
    let lt_time = query.lt_time
    let url = `/get_data_with_condition?page=${page}&in_hospital_id=${id}&department=${department}&gt_time=${gt_time}&lt_time=${lt_time}`
    console.log(url)
    return axios.get(url)
}

export {get_data};