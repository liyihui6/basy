<template>
    <div class="main">
        <header class="header">
            <span class="header-title">欢迎使用病案首页质控平台</span>
            <el-button @click="showDialog" style="float: right;margin-right: 10px" type="primary" size=mini>上传文件</el-button>
        </header>
        <div class="container">
            <div class="content-left">
                <div class="content-header">
                    <div class="content-header-item">
                        <span style="display: inline-block; width: 70px">时间范围：</span>
                        <el-date-picker
                            v-model="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            size="mini"
                            style="width: 200px"
                            type="daterange"
                            @change="reflash"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                    <div class="content-header-item">
                        <span style="display: inline-block; width: 70px">筛选科室：</span>
                        <el-select @change="reflash" style="width: 200px" v-model="department" size="mini" placeholder="请选择">
                            <el-option label="全部" value="all">全部</el-option>
                            <el-option value="骨科"></el-option>
                            <el-option value="骨科2"></el-option>
                        </el-select>
                    </div>
                    <div class="content-header-item">
                        <span style="display: inline-block; width: 70px">病案ID：</span>
                        <el-input v-model="id" @input="debounceReflash" style="width: 200px" size="mini" placeholder="请输入"></el-input>
                    </div>
                </div>
                <div class="content-article">
                    <ul style="margin: 0px; padding: 0px">
                    <el-scrollbar :style="{height: descHeight - 150 + 'px', width: '100%'}">
                        <li 
                            :class="{'active': item.selected}"
                            v-for="(item, index) in leftData" :key="item.department + index"
                            class="article-items"
                            @click="selecteItem(item, item.data)"
                        >
                            <span class="article-item">{{item.id}}</span>
                            <span class="article-item">{{item.department}}</span>
                            <span class="article-item">{{item.date}}</span>
                        </li>
                        <el-pagination
                            style="text-align: center;margin-top: 10px"
                            layout="total, prev, pager, next"
                            :current-page.sync="page"
                            @current-change="reflash"
                            :total="total">
                        </el-pagination>
                    </el-scrollbar>
                    </ul>
                </div>
            </div>
            <el-scrollbar :style="{height: descHeight + 'px', width: '100%'}">
                <div v-for="(items, key, index) in rightData" :key="key" class="content-right">
                    <div class="content-title">
                        {{key}}
                    </div>
                    <div class="content-form">
                        <div v-if="index === 0" class="content-form-header">
                            <span class="content-form-header-item">显示字段</span>
                            <span class="content-form-header-item">医生视图(IIH)</span>
                            <span class="content-form-header-item">校正后视图(病案)</span>
                            <span class="content-form-header-item">机器建议(AI)</span>
                        </div>
                        <div v-for="(item, index) in items" :key="item.values[0] + index" class="content-form-article">
                            <span style="border-left: 1px solid grey" class="content-form-article-item">
                                <el-checkbox style="margin-right: 6px" v-model="item.selected"></el-checkbox>
                                <span class="form-cell-content">{{item.values[0]}}</span>
                                <!-- <span style="display: inline-block;">
                                    
                                </span> -->
                            </span>
                            <div class="content-form-article-item">
                                <span class="form-cell-content" v-if="item.selected">{{item.values[1]}}</span>
                            </div>
                            <div class="content-form-article-item">
                                <span class="form-cell-content" :style="{color: item.values[2] === item.values[1] ? 'black' : 'red'}" v-if="item.selected">{{item.values[2]}}</span>
                            </div>
                            <div class="content-form-article-item">
                                <span class="form-cell-content" :style="{color: item.values[3] === item.values[1] ? 'black' : 'red'}" v-if="item.selected">{{item.values[3]}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <footer class="footer">
            <span>Power by Baidu @2019</span>
        </footer>
        <el-dialog title="上传文件" :visible.sync="uploadShow">
            <div>
                <el-upload
                class="upload-demo"
                ref="upload"
                :action="uploadUrl"
                :limit="1"
                :on-remove="handleRemove"
                :multiple="false"
                :data="uploadData"
                :on-change="addFile"
                :file-list="fileList"
                :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                    <div style="display: inline-block;margin-left: 15px">
                        <el-radio-group v-model="uploadData.file_type">
                            <el-radio label="original">原始数据</el-radio>
                            <el-radio label="amended">校正数据</el-radio>
                            <el-radio label="machine">机器数据</el-radio>
                        </el-radio-group>
                    </div>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {debounce} from 'throttle-debounce'
import url from '@/api/config.js'
export default {
    name: 'Index',
    async created() {
        await this.init()
    },
    data() {
        return {
            date: ['all', 'all'],
            department: 'all',
            id: '',
            descHeight: 0,
            selected: true,
            allData: [
                {
                    id: '10086',
                    department: '骨科',
                    date: '2019-10-12',
                    selected: true,
                    data: {
                        '基本信息': [
                            {
                                values: [
                                    'key12',
                                    'value1value1value1value1value1value1value1value1value1value1value1value1value1value1value1value1value1value1value1value1value1value1value1value1value1',
                                    'value2',
                                    'value3',
                                ],
                                selected: true
                            },
                            {
                                values: [
                                    'key',
                                    'value1',
                                    'value2',
                                    'value3',
                                ],
                                selected: true
                            }
                        ],
                        '治疗信息': [
                            {
                                values: [
                                    'key12',
                                    'value1',
                                    'value2',
                                    'value3',
                                ],
                                selected: true
                            },
                            {
                                values: [
                                    'key',
                                    'value1',
                                    'value2',
                                    'value3',
                                ],
                                selected: true
                            }
                        ],
                        '诊断信息': [
                            {
                                values: [
                                    'key12',
                                    'value1',
                                    'value2',
                                    'value3',
                                ],
                                selected: true
                            },
                            {
                                values: [
                                    'key',
                                    'value1',
                                    'value2',
                                    'value3',
                                ],
                                selected: true
                            }
                        ]
                    }
                },
                {
                    id: '1008611',
                    department: '骨科2',
                    date: '2019-10-13',
                    selected: false,
                    data: {
                        '基本信息': [
                            {
                                values: [
                                    'key12',
                                    'value1',
                                    'value2',
                                    'value3',
                                ],
                                selected: true
                            },
                            {
                                values: [
                                    'key',
                                    'value1',
                                    'value2',
                                    'value3',
                                ],
                                selected: true
                            }
                        ],
                        '治疗信息': [
                            {
                                values: [
                                    'key12',
                                    'value1',
                                    'value2',
                                    'value3',
                                ],
                                selected: true
                            },
                            {
                                values: [
                                    'key',
                                    'value1',
                                    'value2',
                                    'value3',
                                ],
                                selected: true
                            }
                        ],
                        '诊断信息': [
                            {
                                values: [
                                    'key12',
                                    'value1',
                                    'value2',
                                    'value3',
                                ],
                                selected: true
                            },
                            {
                                values: [
                                    'key',
                                    'value1',
                                    'value2',
                                    'value3',
                                ],
                                selected: true
                            }
                        ]
                    }
                }
            ],
            leftData: [],
            rightData: [],
            uploadShow: false,
            uploadUrl: url + '/upload',
            fileList: [],
            uploadData: {
                file_type: 'original'
            },
            page: 1,
            total: 0
        }
    },
    methods: {
        async init() {
            this.initParams()
            this.descHeight = window.innerHeight - 120 || 500
            let query = {
                gt_time: '' + this.date[0],
                lt_time: '' + this.date[1],
                id: this.id,
                department: this.department,
                page: this.page
            }
            await this._fetchData(query)
            this.rightData = this.allData.length > 0 ? this.allData[0].data : null
            this.leftData = this.filterData()
        },
        selecteItem(item, data) {
            this.allData.forEach(item => {
                item.selected = false
            })
            item.selected = true
            this.rightData = data
        },
        filterData() {
            // let res = []
            // res = this.allData.filter((item, index) => {
            //     return item.id.indexOf(this.id) >= 0;
            // })
            // res = res.filter(item => {
            //     return item.department === this.department || this.department === 'all'
            // })
            // res = res.filter(item => {
            //     if(this.date === null || this.date.length == 0) {
            //         return true
            //     }
            //     let date = new Date(item.date)
            //     let startDate = this.date[0]
            //     let endDate = this.date[1]
            //     return date >= startDate && date <= endDate
            // })
            // return res
            return this.allData
        },
        async _fetchData(query) {
            await this.$http.get_data(query).then(res => {
                if(res.data.code === 200) {
                    this._normal(res)
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        _normal(res) {
            let allData = []
            let newAllData = []
            allData = res.data.data.data_list
            this.total = res.data.data.total
            console.log('all: ', allData)
            for(let i = 0;i < allData.length;i ++) {
                let data = allData[i]
                let res = {
                    date: data.date,
                    department: data.department,
                    id: data.id,
                    selected: false,
                    data: {}
                }
                let datacontent = data.data
                let keys = ['基本信息', '诊断信息', '治疗信息']
                for(let key in keys) {
                    res.data[key] = []
                    datacontent[key].forEach(ele => {
                        let item = {
                            selected: true,
                            values: []
                        }
                        item.values.push(ele[0])
                        if(ele[1] && ele[1].length > 0) {
                            for(let j = 0;j < 3;j ++) {
                                item.values.push(ele[1][j])
                            }
                        }
                        res.data[key].push(item)
                    })
                }
                console.log(res)
                newAllData.push(res)
            }
            this.allData = newAllData
        },
        initParams() {
            let query = this.$route.query
            if(Reflect.has(query, 'department')) {
                this.department = query.department
            }
            if(Reflect.has(query, 'id')) {
                this.id = query.id
            }
            if(Reflect.has(query, 'page')) {
                this.page = Number(query.page)
            }
            if(Reflect.has(query, 'gt_time')) {
                this.date[0] = query.gt_time
            }
            if(Reflect.has(query, 'lt_time')) {
                this.date[1] = query.lt_time
            }
        },
        async reflash() {
            if(!this.date || this.date.length == 0) { 
                this.date = ['all', 'all']
            }
            let query = {
                gt_time: '' + this.date[0],
                lt_time: '' + this.date[1],
                id: this.id,
                department: this.department,
                page: this.page
            }
            this.$router.replace({
                path: '/',
                query: query
            })
            await this._fetchData(query)
            this.leftData = this.filterData()
            this.rightData = this.allData.length > 0 ? this.allData[0].data : null
        },
        debounceReflash: debounce(1000,function(){
            this.reflash()
        }),
        showDialog() {
            this.uploadShow = true
        },
        addFile(file,fileList) {
            this.fileList = fileList
        },
        submitUpload() {
            console.log(this.fileList, this.uploadUrl)
            let res = this.$refs.upload.submit();
            console.log(res)
        },
        handleRemove(file, fileList) {
            this.fileList = fileList
        },
        handlePreview(file) {
            console.log(file);
        }
    }
}
</script>

<style scoped>

.main{
    width: 100%;
    height: 100%;
    min-height: 100vh;
}


.header{
    padding: 5px 2px 5px 30px;
    border-bottom: 1px solid #eee;
}

.header-title{
    font-weight: 600;
    font-size: 16px;
}

.container{
    width: 100%;
   /* height: calc(100vh - 35px - 42px);*/
    display: flex;
    /*margin-bottom: 100px;*/
}

.content-left{
    width: 340px;
    border-right: 1px solid #eee;
}

.content-header{
    padding: 15px 30px;
    border-bottom: 1px solid #eee;
}

.content-header-item{
    display: flex;
    align-items: center;
    padding: 6px 0;
    font-size: 14px;
}

.content-article{
    padding-top: 10px;
}


.article-items{
    list-style: none;
    border-bottom: 1px solid #eee;
    display: flex;
    padding: 5px;
    cursor: pointer;
    justify-content: space-around;
    align-items: center;
    font-size: 14px;
}
.article-items:first-child{
    border-top: 1px solid #eee;
}
.article-items:hover{
    background: #eee;
}
.article-item{
    width: 33.3%;
}
.active{
    background: #409eff;
}

.content-right{
    border: 1px solid #000;
    flex: 1;
    display: flex;
    align-items: center;
}
.form-cell-content{
    display: inline-block;
    width: 100%;
    /* overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis; */
    white-space:normal;
	word-break:break-all;
	word-wrap:break-word;
}

.content-title{
    padding: 5px;
}

.content-form{
    flex: 1;
    height: 100%;
}
.content-form-header{
    display: flex;
    /* border-top: 1px solid grey; */
    align-items: center;
    text-align: left;
}
.content-form-article{
    width: 100%;
    display: flex;
    align-items: stretch;
    text-align: left;
    border-bottom: 1px solid grey;
}

.content-form-article:nth-child(2n-1){
    background: #eee;
}
.content-form-article:last-child{
    border-bottom: nooe;
}

.content-form-header-item{
    display: inline-block;
    padding: 5px;
    border-right: 1px solid grey;
    border-bottom: 1px solid grey;
    font-size: 14px;
    font-weight: 600;
    width: 25%;
}

.content-form-header-item:last-child{
    border-right: 1px solid #eee;
}
.content-form-header-item:first-child{
    border-left: 1px solid grey;
}

.content-form-article-item{
    display: flex;
    align-items: center;
    padding: 5px;
    text-align: left;
    border-right: 1px solid grey;
    font-size: 14px;
    width: 25%;
    min-height: 25px;
}


.footer{
    margin: 0 auto;
    border-top: 1px solid #eee;
    text-align: center;
    padding: 10px;
    font-weight: 600;
}
</style>

<style >
    .el-scrollbar__wrap{
        overflow-x: hidden !important;
    }
</style>