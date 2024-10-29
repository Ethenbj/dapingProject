<script setup lang="ts">
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";
import {ElMessage} from "element-plus";
import {UserService} from "@/api/login/login";
import store from "@/store";



  const router = useRouter();
  const loginForm = ref(null);
  // 登录
  const form = reactive({
    username: '',
    password: '',
  })

  // 规则
  const rules = {
    username: [
      { required: true, message: '请输入账号', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      // { min: 6, message: 'Password length should be greater than 6', trigger: 'blur' }
    ]
  };

const submitForm = () => {
  loginForm.value.validate(async (valid) => {
    if (valid) {
      const loginParams = {
        username: form.username,
        password: form.password,
      }
      const resp = await UserService.login(loginParams
      ).then(resp => {
        console.log(resp)
        // debugger
        if (resp.code == 500) {
          ElMessage.error(resp.msg)
        }
        if (resp.code == 200) {
          // localStorage.setItem('username', resp.data.username)
          store.commit('setToken', resp.data.token);
          router.push({name: 'home'})
        }
      })

      // Handle login logic here
    } else {
      ElMessage.error('登录失败')
    }
  });
};

</script>

<template>
  <div class="screen-bg">
    <div class="container">
    <el-form ref="loginForm" :model="form" :rules="rules">
      <div class="title-container" style="margin-top: 20px;">
        <h3 class="title">监管大屏</h3>
      </div>
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="submit" @click="submitForm">Login</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.screen-bg {
  width: 1920px;
  height: 1080px;
  background-image: url("@/assets/img/纯背景.png");
  background-size: cover;

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;

    .el-form{
      //background-color: red;
      .submit{
        background-color: #fff;
        color: #ccc;
        border: none;
        &:hover{
          color: #409EFF;
        }
      }
    }
  }
}
</style>