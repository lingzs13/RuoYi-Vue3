<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="资产编号" prop="uuid">
        <el-input v-model="queryParams.uuid" placeholder="请输入资产编号" clearable @keyup.enter="handleQuery" style="width: 200px"/>
      </el-form-item>
      <el-form-item label="资产类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择资产类型" clearable style="width: 200px">
          <el-option v-for="dict in device_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="厂商" prop="supplier">
        <el-select v-model="queryParams.supplier" placeholder="请选择厂商" clearable style="width: 200px" >
          <el-option
            v-for="dict in supplier_name_id"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="资产名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入资产名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input
          v-model="queryParams.price"
          placeholder="请输入价格"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 200px">
          <el-option v-for="dict in computer_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="入库时间" prop="purchaseDate">
        <el-date-picker clearable v-model="queryParams.purchaseDate" type="date" value-format="YYYY-MM-DD"
          placeholder="请选择入库时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="出库时间" prop="expectedRetirementDate">
        <el-date-picker clearable v-model="queryParams.expectedRetirementDate" type="date" value-format="YYYY-MM-DD"
          placeholder="请选择预计出库时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="租借人" prop="employee">
        <el-input v-model="queryParams.employee" placeholder="请输入租借人" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="租借部门" prop="department">
        <el-select v-model="queryParams.department" placeholder="请选择租借部门" clearable style="width: 200px">
          <el-option v-for="dict in description_id" :key="dict.value" :label="dict.label" :value="dict.value"  />
        </el-select>
      </el-form-item>
      <el-form-item label="租借时间" prop="leaseStartTime">
        <el-date-picker clearable v-model="queryParams.leaseStartTime" type="date" value-format="YYYY-MM-DD"
          placeholder="请选择租借时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Upload" @click="handleImport"
          >导入</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="资产编号" align="center" prop="uuid" />
      <el-table-column label="资产类型" align="center" prop="type">
        <template #default="scope">
          <dict-tag :options="device_type" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="厂商" align="center" prop="supplier">
        <template #default="scope">
          <dict-tag :options="supplier_name_id" :value="scope.row.supplier"/>
        </template>
      </el-table-column>
      <el-table-column label="资产名称" align="center" prop="name" />
      <el-table-column label="价格" align="center" prop="price" >
        <template #default="scope">
          <span>￥{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="computer_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="入库时间" align="center" prop="purchaseDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.purchaseDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计出库时间" align="center" prop="expectedRetirementDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.expectedRetirementDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租借人" align="center" prop="employee" />
      <el-table-column label="租借部门" align="center" prop="department">
        <template #default="scope">
          <dict-tag :options="description_id" :value="scope.row.department" />
        </template>
      </el-table-column>
      <el-table-column label="租借时间" align="center" prop="leaseStartTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.leaseStartTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="note" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            >修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改设备对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="deviceRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="资产编号" prop="uuid">
          <el-input v-model="form.uuid" placeholder="请输入资产编号" />
        </el-form-item>
        <el-form-item label="资产类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择资产类型">
            <el-option v-for="dict in device_type" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厂商" prop="supplier">
          <el-select v-model="form.supplier" placeholder="请选择厂商">
            <el-option
              v-for="dict in supplier_name_id"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资产名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入资产名称" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option v-for="dict in computer_status" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库时间" prop="purchaseDate">
          <el-date-picker clearable v-model="form.purchaseDate" type="date" value-format="YYYY-MM-DD"
            placeholder="请选择入库时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计出库时间" prop="expectedRetirementDate">
          <el-date-picker clearable v-model="form.expectedRetirementDate" type="date" value-format="YYYY-MM-DD"
            placeholder="请选择预计出库时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="租借人" prop="employee">
          <el-input v-model="form.employee" placeholder="请输入租借人" />
        </el-form-item>
        <el-form-item label="租借部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择租借部门">
            <el-option v-for="dict in description_id" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="租借时间" prop="leaseStartTime">
          <el-date-picker clearable v-model="form.leaseStartTime" type="date" value-format="YYYY-MM-DD"
            placeholder="请选择租借时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="form.note" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 数据导入对话框 -->
    <el-dialog title="数据导入" v-model="excelOpen" width="400px" append-to-body>
      <el-upload ref="uploadRef" class="upload-demo"
        :action="uploadExcelUrl"
        :headers="headers"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :before-upload="handleBeforeUpload"
        :limit="1" 
        :auto-upload="false">
        <template #trigger>
          <el-button type="primary">上传文件</el-button>
        </template>

        <el-button class="ml-3" type="success" @click="submitUpload">
          上传
        </el-button>

        <template #tip>
          <div class="el-upload__tip">
            上传文件格式，仅允许导入xls、xlsx格式。
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script setup name="Device">
import { listDevice, getDevice, delDevice, addDevice, updateDevice } from "@/api/code/device";
import { getToken } from "@/utils/auth";
const { proxy } = getCurrentInstance();
const { description_id, computer_status, device_type, supplier_name_id } = proxy.useDict('description_id', 'computer_status', 'device_type', 'supplier_name_id');

const deviceList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    uuid: null,
    type: null,
    name: null,
    status: null,
    purchaseDate: null,
    expectedRetirementDate: null,
    employee: null,
    department: null,
    leaseStartTime: null,
    note: null
  },
  rules: {
    uuid: [
      { required: true, message: "资产编号不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "资产类型不能为空", trigger: "change" }
    ],
    supplier: [
      { required: true, message: "厂商不能为空", trigger: "change" }
    ],
    name: [
      { required: true, message: "资产名称不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "价格不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
    purchaseDate: [
      { required: true, message: "入库时间不能为空", trigger: "blur" }
    ],
    expectedRetirementDate: [
      { required: true, message: "预计出库时间不能为空", trigger: "blur" }
    ],
  }
});
// import { importTemplate } from "@/api/system/user";
const { queryParams, form, rules } = toRefs(data);

/** 查询设备列表 */
function getList() {
  loading.value = true;
  listDevice(queryParams.value).then(response => {
    deviceList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    uuid: null,
    type: null,
    name: null,
    status: null,
    purchaseDate: null,
    expectedRetirementDate: null,
    employee: null,
    department: null,
    leaseStartTime: null,
    note: null
  };
  proxy.resetForm("deviceRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加设备";
  //入库时间自动填写为当前时间
  form.value.purchaseDate = formatToYMD(new Date());
  form.value.expectedRetirementDate = new Date();
  form.value.expectedRetirementDate.setFullYear(form.value.expectedRetirementDate.getFullYear() + 4);
  form.value.expectedRetirementDate = form.value.expectedRetirementDate.toISOString().substring(0, 10);
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getDevice(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改设备";
    //入库时间自动
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["deviceRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDevice(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDevice(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除设备编号为"' + _ids + '"的数据项？').then(function () {
    return delDevice(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('code/device/export', {
    ...queryParams.value
  }, `device_${new Date().getTime()}.xlsx`)
}

/** 导入按钮操作 */
const excelOpen = ref(false);
function handleImport() {
  excelOpen.value = true;
}
/** 上传excel文件 */
const uploadRef=ref({});
function submitUpload(){
  uploadRef.value.submit();
} 
/**上传地址 */
const uploadExcelUrl = ref(import.meta.env.VITE_APP_BASE_API+"/code/record/import");
/**上传请求头 */
const headers = ref({Authorization: "Bearer " + getToken()})
/**上传成功的回调 */
function handleUploadSuccess(res, file) {
  // 如果上传成功
  if (res.code == 200) {
    // 刷新列表
    getList();
    // 关闭对话框
    excelOpen.value = false;
    // 提示信息
    proxy.$modal.msgSuccess("导入成功");
  } else {
    proxy.$modal.msgError(res.msg);
  }
  uploadRef.value.clearFiles();
  proxy.$modal.closeLoading();
}
/**上传失败的回调 */
function handleUploadError() {
  proxy.$modal.msgError("上传文件失败");
  proxy.$modal.msgError(res.msg);
  proxy.$modal.closeLoading();
}
//上传前校验
const props = defineProps({
  moduleValue: [String,Object,Array],
  //大小限制
  fileSize:{
    type: Number,
    default:10,
  },
  //格式限制
  fileType:{
    type: Array,
    default: () => [ "xls","xlsx"]
  }
});
//上传前loading加载
function handleBeforeUpload(file){
  let isExcel = false;
  if(props.fileType.length){
    let fileExtension = "";
    if(file.name.lastIndexOf(".") > -1){
      fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
    }
    isExcel = props.fileType.some(type => {
      if(file.type.indexOf(type) > -1) return true;
      if(fileExtension && fileExtension.indexOf(type) > -1) return true;
      return false;
    });
  }
  if(!isExcel){
    proxy.$modal.msgError(`文件格式不正确, 请上传${props.fileType.join("/")}文件!`);
    return false;
  }
  proxy.$modal.loading("正在上传文件，请稍候...");
}
getList();
function formatToYMD(date) {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() 返回 0-11
  var day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
</script>
