<template>
  <div class="modal fade" id="bindAcpName" tabindex="-1" role="dialog" aria-labelledby="bindAcpNameTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="bindAcpNameTitle">Выберите наименование АБЗ из списка</h5>
        </div>
        <div class="modal-body">
          <select class="form-control" @change="plantSelect" id="bindAcpNameList">
            <option v-for="(item, index) in plants" :key="index" :value="item.id">{{ item.name }}, {{ item.address }}</option>
          </select>
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
  name: 'BindName',
  data: function () {
    return {
      plants: [
        {id: 25, name: 'АБЗ 1'},
        {id: 27, name: 'АБЗ 2'},
        {id: 29, name: 'АБЗ 3'}
      ],
      plant: 0
    }
  },
  methods: {
    plantSelect: function (e) {
      this.plant = parseInt(e.target.value)
    },
    buttonSaveClick: function () {
      this.$emit('plantNameSelect', {
        ext_id: this.plant
      })
      $('#bindAcpNameList option[value=' + this.plant + ']').remove()
      $('#bindAcpName').modal('hide')
    },
    buttonCancelClick: function () {
      this.$emit('plantNameSelect', {
        ext_id: -1
      })
      $('#bindAcpName').modal('hide')
    },
    show: function (){
      $('#bindAcpName').modal({
        backdrop: 'static'
      });
    }
  },
  mounted() {
    let $this = this
    $.ajax(process.env.VUE_APP_API_URL + 'plant/free', {
      dataType: 'json',
      method: 'GET',
      mode: "no-cors",
    }).done(function (data) {
      $this.plants = data.data
    }).fail(function (data) {
      console.log('Oшибка получения данных: ' + data);
    });
  }
}
</script>

<style>
</style>