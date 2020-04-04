<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input clearable @clear="getUserList" type="text" v-model="queryParam.query" prefix-icon="iconfont icon-icon-test2" placeholder="请输入搜索内容">
            <el-button slot="append" @click="getUserList">搜索</el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addUserDialog=true">添加用户</el-button>
        </el-col>
      </el-row>
      <div style="margin-top: 20px">
        <template>
          <el-table :data="userList" stripe style="width: 100%" border>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="role_name" label="角色" ></el-table-column>
            <el-table-column prop="mobile" label="手机号"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="create_time" label="用户创建时间"></el-table-column>
            <el-table-column prop="mg_state" label="状态">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.mg_state" @change="handleSwitchChange(scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑用户" placement="top" :enterable="false">
                  <el-button type="primary" icon="el-icon-edit" circle @click="showUpdateUserDialog(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                  <el-button type="warning" icon="el-icon-setting" circle @click="showChangeRoleDialog(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" circle @click="delUser(scope.row.id)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div class="block" style="margin-top: 15px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryParam.pagenum"
            :page-sizes="[1, 5, 10, 20, 50]"
            :page-size="queryParam.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </el-card>
    <!--添加用户对话框-->
    <el-dialog title="添加用户" :visible.sync="addUserDialog" width="20%" @close="addUserDialogClose">
      <el-form :model="addUserForm" :rules="userRules" ref="addUserFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddUserForm">确定</el-button>
        <el-button @click="addUserDialog=false">取消</el-button>
      </span>
    </el-dialog>
    <!--编辑用户对话框-->
    <el-dialog title="编辑用户" :visible.sync="updateUserDialog" width="20%" @close="updateUserDialogClose">
      <el-form :model="updateUserForm" :rules="userRules" ref="updateUserFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="updateUserForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="updateUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpdateUserForm">确定</el-button>
        <el-button @click="addUserDialog=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addUser, deleteUser, getUser, getUserList, updateUser, updateUserState } from '@/api'
import { emailValidator, mobileValidator, passwordValidator, usernameValidator } from '@/util/validatorRulesUtil'

export default {
  name: 'Users',
  mounted () {
    this.getUserList()
  },
  data () {
    return {
      queryParam: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      userList: [],
      addUserDialog: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      userRules: {
        username: [
          { required: true, trigger: 'blur', validator: usernameValidator }
        ],
        password: [
          { required: true, trigger: 'blur', validator: passwordValidator }
        ],
        email: [
          { required: false, trigger: 'blur', validator: emailValidator }
        ],
        mobile: [
          { required: false, trigger: 'blur', validator: mobileValidator }
        ]
      },
      updateUserDialog: false,
      updateUserForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      }
    }
  },
  methods: {
    async getUserList () {
      const res = await getUserList(this.queryParam)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    async disableUser () {
    },
    handleSizeChange (val) {
      this.queryParam.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.queryParam.pagenum = val
      this.getUserList()
    },
    async handleSwitchChange (param) {
      const res = await updateUserState(param)
      if (res.meta.status !== 200) {
        param.mg_state = !param.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    addUserDialogClose () {
      this.$refs.addUserFormRef.resetFields()
    },
    updateUserDialogClose () {
      this.$refs.updateUserFormRef.resetFields()
    },
    submitAddUserForm () {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const res = await addUser(this.addUserForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.addUserDialog = false
        this.getUserList()
      })
    },
    submitUpdateUserForm () {
      this.$refs.updateUserFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const res = await updateUser(this.updateUserForm)
        if (res.meta.status !== 200) {
          this.$message.error('更新失败')
        } else {
          this.$message.success('更新成功')
        }
        this.updateUserDialog = false
        this.updateUserDialogClose()
        this.getUserList()
      })
    },
    async showUpdateUserDialog (userId) {
      this.updateUserDialog = true
      const res = await getUser(userId)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.updateUserForm = res.data
    },
    delUser (userId) {
      this.$confirm('是否永久删除此用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteUser(userId)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getUserList()
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },
    showChangeRoleDialog (userId) {
    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-card {

}
</style>
