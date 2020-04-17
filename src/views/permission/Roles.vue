<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top: 15px">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe style="margin-top: 15px">
        <el-table-column type="expand">
          <template slot-scope="scope">
              <el-row :class="['vcenter', 'bdbottom', index1 === 0 ? 'bdtop' : '']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
                <!--一级权限-->
                <el-col :span="5">
                  <el-tag closable @close="removeRoleRight(scope.row, item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!--二和三级权限-->
                <el-col :span="19">
                  <el-row :class="['vcenter', index2 === 0 ? '' : 'bdtop']" v-for="(item2, index2) in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="removeRoleRight(scope.row, item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRoleRight(scope.row, item3.id)">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRole(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="delRole(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="setRight(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加角色对话框-->
    <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="25%" @close="addRoleDialogClose">
      <el-form :rules="roleRules" :model="addRoleForm" ref="addRoleFormRef" label-width="80px">
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="addRoleForm.roleName" palceholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item prop="roleDesc" label="角色描述">
          <el-input v-model="addRoleForm.roleDesc" palceholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submitAddRoleForm">添加</el-button>
        <el-button @click="addRoleVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <!--编辑角色对话框-->
    <el-dialog title="编辑角色" :visible="editRoleVisible" width="25%" @close="editRoleDialogClose">
      <el-form :rules="roleRules" :model="editRoleForm" ref="editRoleFormRef" label-width="80px">
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item prop="roleDesc" label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button type="primary" @click="submitEditRoleForm">修改</el-button>
          <el-button @click="editRoleVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <!--分配权限对话框-->
    <el-dialog title="分配权限" :visible="setRightVisible" width="25%" @close="setRightDialogClose">
      <el-tree ref="treeRef" :data="rightsList" :props="treeProps" show-checkbox  default-expand-all node-key="id" :default-checked-keys="defaultKeys"></el-tree>
      <span slot="footer">
        <el-button type="primary" @click="submitRights">修改</el-button>
        <el-button @click="setRightDialogClose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addRole,
  deleteRole,
  deleteRoleRight,
  getAllRight,
  getRoleById,
  getRoleList,
  updateRights,
  updateRole
} from '@/api'

export default {
  name: 'Roles',
  mounted () {
    this.loadRoleList()
  },
  data () {
    return {
      roleId: '',
      editRoleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      roleList: [],
      addRoleVisible: false,
      editRoleVisible: false,
      setRightVisible: false,
      roleRules: {
        roleName: [
          { required: true }
        ],
        roleDesc: [
          { required: false }
        ]
      },
      rightsList: [],
      defaultKeys: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    async setRight (role) {
      this.roleId = role.id
      const res = await getAllRight('tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.rightsList = res.data
      this.getLeafKeys(role, this.defaultKeys)
      this.setRightVisible = true
    },
    setRightDialogClose () {
      this.setRightVisible = false
      this.defaultKeys = []
    },
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    async loadRoleList () {
      const res = await getRoleList()
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
    },
    async editRole (roleId) {
      const res = await getRoleById(roleId)
      if (res.meta.status !== 200) {
        return this.$message.error('加载失败')
      }
      this.editRoleForm.id = roleId
      this.editRoleForm.roleName = res.data.roleName
      this.editRoleForm.roleDesc = res.data.roleDesc
      this.editRoleVisible = true
    },
    editRoleDialogClose () {
      this.editRoleVisible = false
      this.$refs.editRoleFormRef.resetFields()
    },
    async delRole (roleId) {
      const res = await deleteRole(roleId)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.loadRoleList()
    },
    addRoleDialogClose () {
      this.addRoleVisible = false
      this.$refs.addRoleFormRef.resetFields()
    },
    submitAddRoleForm () {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const res = await addRole(this.addRoleForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加失败')
        } else {
          this.$message.success('添加成功')
          this.loadRoleList()
          this.addRoleDialogClose()
        }
      })
    },
    submitEditRoleForm () {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const res = await updateRole(this.editRoleForm)
        if (res.meta.status !== 200) {
          this.$message.error('更新失败')
        } else {
          this.$message.success('更新成功')
          this.loadRoleList()
          this.editRoleDialogClose()
        }
      })
    },
    async submitRights () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const res = await updateRights(this.roleId, idStr)
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      }
      this.$message.success('更新成功')
      this.loadRoleList()
      this.setRightVisible = false
    },
    async removeRoleRight (role, rightId) {
      const confirmRes = await this.$confirm(
        '是否移除此权限?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      if (confirmRes !== 'confirm') {
        return this.$message.info('取消删除')
      } else {
        const res = await deleteRoleRight(role.id, rightId)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        role.children = res.data
      }
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.bdbottom {
   border-bottom: 1px solid #eee;
 }
.bdtop {
   border-top: 1px solid #eee;
 }
.vcenter {
  display: flex;
  align-items: center;
}
</style>
