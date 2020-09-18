<template>
  <div class="modal fade" v-bind:id="formId" tabindex="-1" role="dialog" v-bind:aria-labelledby="formId + 'Title'" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" v-bind:id="formId + 'Title'">Работы на участке дороги</h5>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label v-bind:for="formId + 'Name'">Наименование</label>
            <input v-model.trim="formData.name" type="text" class="form-control" v-bind:id="formId + 'Name'" v-bind:aria-describedby="formId + 'NameHelp'" placeholder="введите наименование">
            <small v-bind:id="formId + 'NameHelp'" class="form-text text-muted">Введите наименование обекта</small>
          </div>
          <div class="form-group">
            Длина выбранного участка дороги: <span style="color: red">{{ formData.length }} м.</span>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="buttonCancelClick">Отмена</button>
          <button type="button" class="btn btn-primary" @click="buttonSaveClick">Сохранить изменения</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import $ from 'jquery'


export default {
  name: 'SendSectionRoad',
  data: function () {
    return {
      formId: 'sendSectionRoad',
      formData: {
        name: '',
        length: 0
      }
    }
  },
  methods: {
    buttonSaveClick: function () {
      this.$emit(this.formId, {
        success: true
      })
      $('#' + this.formId).modal('hide')
    },
    buttonCancelClick: function () {
      this.$emit(this.formId, {
        success: false
      })
      $('#' + this.formId).modal('hide')
    },
    show: function (data){
      this.formData.length = data.length
      $('#' + this.formId).modal({
        backdrop: 'static'
      });
    }
  }
}
</script>

<style>
</style>