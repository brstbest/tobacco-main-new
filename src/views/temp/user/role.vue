<template>
  <div class="role">
    <el-row class="role-button-row">
      <el-button type="primary">新增角色</el-button>
    </el-row>
    <el-row class="role-table-row">
      <el-table
      :data="tableData">
      <template v-for="(item, index) in tableColumns">
        <el-table-column
        :prop="item.key"
        :label="item.label"
        :key="index"
        :fixed="item.key === 'operate' ? 'right' : ''">
          <template v-if="item.key === 'operate'" v-slot="scope">
            <el-button type="primary" size="small">编辑</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </template>
      </el-table>
    </el-row>

  </div>
</template>

<script>
  export default{
    name: 'RolePage',
    components: {

    },
    data() {
      return {
        tableColumns: [
          {key: 'roleKey', label: '角色标识'},
          {key: 'roleName', label: '角色名'},
          {key: 'description', label: '描述'},
          {key: 'operate', label: '操作'},
        ],
        tableData: [],
      }
    }
  }
</script>

<style>
  .role-button-row, .role-table-row{
    padding: 20px;
    padding-bottom: 10px;
  }
</style>
