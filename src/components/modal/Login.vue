<template>
  <div class="modal fade" v-bind:id="formId" tabindex="-1" role="dialog" v-bind:aria-labelledby="formId + 'Title'" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" v-bind:id="formId + 'Title'">Вход</h5>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label v-bind:for="formId + 'Login'">Логин</label>
            <input v-model.trim="formData.login" type="text" class="form-control" v-bind:id="formId + 'Login'" v-bind:aria-describedby="formId + 'LoginHelp'">
            <small v-bind:id="formId + 'LoginHelp'" class="form-text text-muted">Введите свой логин</small>
          </div>
          <div class="form-group">
            <label v-bind:for="formId + 'Password'">Пароль</label>
            <input v-model.trim="formData.password" type="password" class="form-control" v-bind:id="formId + 'Password'" v-bind:aria-describedby="formId + 'PasswordHelp'">
            <small v-bind:id="formId + 'PasswordHelp'" class="form-text text-muted">Введите пароль</small>
            <div class="error">{{ error }}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="buttonOkClick">Ок</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import $ from 'jquery'
import GetMapData from "@/classes/GetMapData";


export default {
  name: 'Login',
  data: function () {
    return {
      formId: 'loginForm',
      formData: {
        login: '',
        password: ''
      },
      error: ''
    }
  },
  methods: {
    buttonOkClick: function () {
      let $this = this;
      $.ajax(process.env.VUE_APP_API_URL + 'auth', {
        dataType: 'json',
        method: 'POST',
        mode: "no-cors",
        data: this.formData
      }).done(function (data) {
        $this.checkLoginResponse(data)
      }).fail(function (data) {
        console.log('Oшибка получения данных: ' + data);
      });

      this.$emit(this.formId, {
        success: true
      })
    },
    checkLoginResponse: function (data){
      let $this = this
      if (data.success == '1'){
        $('#' + this.formId).modal('hide')
      }else{
        this.error = data.message
        $('#' + this.formId + ' .error').show('slow')
        setTimeout(function (){
          $('#' + $this.formId + ' .error').hide('slow')
          $this.error = ''
        }, 3000)
      }
    },
    show: function (){
      $('#' + this.formId).modal({
        backdrop: 'static'
      });
    }
  },
  mounted() {
    let getMapData = new GetMapData()
    getMapData.receive('auth/check', (data) => {
      console.log(data)
    })
    this.show()
  }
}
</script>

<style>
</style>