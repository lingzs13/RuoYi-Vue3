<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="资产编号" prop="deviceUuid">
        <el-input
          v-model="queryParams.deviceUuid"
          placeholder="请输入资产编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="租借人" prop="employee">
        <el-input
          v-model="queryParams.employee"
          placeholder="请输入租借人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="租借部门" prop="department">
        <el-select v-model="queryParams.department" placeholder="请选择租借部门" clearable>
          <el-option
            v-for="dict in description_id"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="租借时间" prop="leaseStartTime">
        <el-date-picker clearable
          v-model="queryParams.leaseStartTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择租借时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="归还时间" prop="leaseEndTime">
        <el-date-picker clearable
          v-model="queryParams.leaseEndTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择归还时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="租借天数" prop="allTime">
        <el-input
          v-model="queryParams.allTime"
          placeholder="请输入租借天数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['code:record:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['code:record:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['code:record:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['code:record:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键id" align="center" prop="id" /> -->
      <el-table-column label="资产编号" align="center" prop="deviceUuid" />
      <el-table-column label="租借人" align="center" prop="employee" />
      <el-table-column label="租借部门" align="center" prop="department">
        <template #default="scope">
          <dict-tag :options="description_id" :value="scope.row.department"/>
        </template>
      </el-table-column>
      <el-table-column label="租借时间" align="center" prop="leaseStartTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.leaseStartTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="归还时间" align="center" prop="leaseEndTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.leaseEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租借天数" align="center" prop="allTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['code:record:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['code:record:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改租赁管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="recordRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="资产编号" prop="deviceUuid">
          <el-input v-model="form.deviceUuid" placeholder="请输入资产编号" />
        </el-form-item>
        <el-form-item label="租借人" prop="employee">
          <el-input v-model="form.employee" placeholder="请输入租借人" />
        </el-form-item>
        <el-form-item label="租借部门" prop="department">
          <el-select v-model="form.department" placeholder="请选择租借部门">
            <el-option
              v-for="dict in description_id"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="租借时间" prop="leaseStartTime">
          <el-date-picker clearable
            v-model="form.leaseStartTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择租借时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="归还时间" prop="leaseEndTime">
          <el-date-picker clearable
            v-model="form.leaseEndTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择归还时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Record">
import { listRecord, getRecord, delRecord, addRecord, updateRecord } from "@/api/code/record";

const { proxy } = getCurrentInstance();
const { description_id } = proxy.useDict('description_id');

const recordList = ref([]);
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
    deviceUuid: null,
    employee: null,
    department: null,
    leaseStartTime: null,
    leaseEndTime: null,
    allTime: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询租赁管理列表 */
function getList() {
  loading.value = true;
  listRecord(queryParams.value).then(response => {
    recordList.value = response.rows;
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
    deviceUuid: null,
    employee: null,
    department: null,
    leaseStartTime: null,
    leaseEndTime: null,
    allTime: null
  };
  proxy.resetForm("recordRef");
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
  title.value = "添加租赁管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getRecord(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改租赁管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["recordRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateRecord(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRecord(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除租赁管理编号为"' + _ids + '"的数据项？').then(function() {
    return delRecord(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('code/record/export', {
    ...queryParams.value
  }, `record_${new Date().getTime()}.xlsx`)
}

getList();
</script>
