<template>
  <div id="tables-page">
    <div id="form">
      <form @submit.prevent="handleSubmit">
        <h1>Table Entry</h1>
        <div class="form-group">
          <label>Table name</label>
          <input type="text" class="form-input-1 input" v-model="tableName" />
        </div>
        <div class="form-group">
          <label>Table number</label>
          <input type="text" class="form-input-2 input" v-model="tableNumber" />
        </div>
        <div class="form-group">
          <label>Table type</label>
          <div class="custom-select">
            <select name="tableType" v-model="tableType.model">
              <option value="">Select Type</option>
              <option :value="type.text" v-for="type in types" :key="type.id">
                {{ type.text }}
              </option>
            </select>
            <span class="custom-arrow"></span>
          </div>
        </div>
        <div class="res">
          <h2>For Reservation</h2>
          <div class="input-group">
            <div class="radio-group">
              <input
                type="radio"
                name="reservation"
                value="yes"
                v-model="forReservation"
              />
              <label>Yes</label>
            </div>
            <div class="radio-group">
              <input
                type="radio"
                name="reservation"
                value="no"
                v-model="forReservation"
              />
              <label>No</label>
            </div>
          </div>
        </div>
        <div class="cta">
          <button>{{ edit ? 'update' : 'save' }}</button>
        </div>
      </form>
      <div class="info">
        <span class="material-icons icon">info</span>
        <span>Click on available action to see the generate QRCode</span>
      </div>
    </div>
    <div id="tables">
      <div class="table-header">
        <span>Table name</span>
        <span class="number">Table number</span>
        <span class="type">Table type</span>
        <span class="res">For Reservation</span>
      </div>
      <div class="tables">
        <div
          class="table"
          v-for="(table, index) in tableList"
          :key="table._id"
          :class="{ first: index === 0 }"
        >
          <p class="name">{{ table.tableName }}</p>
          <p class="number">{{ table.tableNumber }}</p>
          <p class="type">{{ table.tableType }}</p>
          <p class="res">
            {{ table.forReservation.includes('t') ? 'Yes' : 'No' }}
          </p>
          <div class="options">
            <div
              class="options-icon"
              @click="showOptions($event)"
              v-on-clickaway="hideOptions"
            >
              <span class="text">Action</span>
              <span class="material-icons">arrow_drop_down</span>
            </div>
            <div class="tools" v-show="active === table._id" :id="active">
              <div class="edit">
                <span @click="editTable(table)">edit</span>
              </div>
              <div class="delete">
                <span @click="deleteCurrentTable(table._id)">delete</span>
              </div>
              <div class="print">
                <span @click="printCode(table._id)">generate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="qrcode-container">
      <embed v-if="qrcode" :src="qrcode" />
    </div>
  </div>
</template>

<script>
import { v4 } from 'uuid'
import { mapActions, mapState, mapGetters } from 'vuex'
import { bus } from '~/layouts/default.vue'
import { mixin as clickaway } from 'vue-clickaway'
export default {
  mixins: [clickaway],
  data() {
    return {
      active: null,
      edit: false,
      id: '',
      tableName: '',
      tableNumber: '',
      tableType: {
        model: '',
        invalid: false,
      },
      types: [
        {
          id: v4(),
          text: 'Regular',
        },
        {
          id: v4(),
          text: 'VIP',
        },
      ],
      forReservation: false,
      src: '',
    }
  },
  computed: {
    ...mapState(['tables']),
    ...mapGetters({
      qrcode: 'qrcode/qrcode',
      tableList: 'tables/tableList',
    }),
  },
  async created() {
    await this.getTables()
  },
  mounted() {
    this.setQrCode()
  },
  methods: {
    ...mapActions({
      createTable: 'tables/createTable',
      deleteTable: 'tables/deleteTable',
      generateCode: 'qrcode/generateCode',
      getTables: 'tables/getTables',
      setQrCode: 'qrcode/setQrCode',
      updateTable: 'tables/updateTable',
    }),
    editTable(table) {
      this.edit = true
      this.id = table._id
      this.tableName = table.tableName
      this.tableNumber = table.tableNumber
      this.tableType.model = table.tableType
      this.forReservation = table.forReservation == false ? false : true
    },
    async deleteCurrentTable(tableId) {
      try {
        await this.deleteTable(tableId)
        bus.$emit('showPopup', {
          message: 'Table deleted',
          success: true,
        })
      } catch (error) {
        bus.$emit('showPopup', {
          message: error.message,
          success: false,
        })
      }
    },
    hideOptions(event) {
      const { target } = event
      if (
        !target.classList.contains('options-icon') &&
        !target.classList.contains('text') &&
        !target.classList.contains('material-icons')
      ) {
        this.removeClass()
      }
    },
    async handleSubmit() {
      const { tableName, tableNumber, tableType, forReservation } = this
      if (!this.edit) {
        const data = {
          tableNumber,
          tableName,
          tableType: tableType.model,
          forReservation: forReservation === 'no' ? false : true,
        }
        try {
          await this.createTable(data)
          this.tableName = ''
          this.tableNumber = ''
          this.tableType.model = ''
          this.forReservation = ''
        } catch (error) {
          bus.$emit('showPopup', {
            success: false,
            message: 'Couldnt process your request. Try again',
          })
        }
      } else {
        const data = {
          _id: this.id,
          tableNumber,
          tableName,
          tableType: tableType.model,
          forReservation: forReservation,
        }
        try {
          await this.updateTable(data)
          this.id = ''
          this.edit = false
          this.tableName = ''
          this.tableNumber = ''
          this.tableType.model = ''
          this.forReservation = ''
          this.tableList = this.tables.tables
        } catch (error) {
          bus.$emit('showPopup', {
            success: false,
            message: 'Couldnt process your request. Try again',
          })
        }
      }
    },
    async printCode(tableId) {
      try {
        this.setQrCode()
        await this.generateCode(tableId)
      } catch (error) {
        bus.$emit('showPopup', {
          success: false,
          message: 'Couldnt process your request. Try again',
        })
      }
    },
    removeClass() {
      const tools = document.querySelectorAll('.tools.active')
      tools.forEach((tool) => {
        tool.classList.remove('active')
      })
    },
    setTableType(event) {
      const target = event.target
      const { name, value } = target
      this[name].model = value
      if (!this[name].model || this[name].model.length < 4) {
        this[name].invalid = true
        this[name].error = true
      } else {
        this[name].invalid = false
        this[name].error = false
      }
    },
    showOptions(event) {
      const { target } = event
      this.removeClass()
      if (target.classList.contains('options-icon')) {
        target.nextElementSibling.classList.add('active')
      } else {
        target.parentElement.nextElementSibling.classList.add('active')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#tables-page {
  margin-top: 4em;
  padding: 1em 0.5em;
  @include grid;
  grid-template-columns: 2.5fr 1.5fr;
  #form {
    grid-column: 2/3;
    margin-top: 0 !important;
    margin-bottom: 1em !important;
    form {
      @include form;
      @include grid;
      grid-template-columns: 6fr 8fr;
      background: var(--white) !important;
      width: 100% !important;
      max-width: 100% !important;
      border-radius: 2px !important;
      box-shadow: none !important;
      margin: 0 auto;
      padding: 0.5em 1em;
      h1 {
        grid-column: 1/2;
        margin-left: 0;
        color: var(--dark) !important;
        text-align: left;
        font-size: 16px;
        font-weight: bold;
      }
      .form-group {
        grid-column: 1/3;
        grid-template-columns: 6fr 8fr;
        @include flexCenterVariant;
        @include grid;
        margin: 5px 0;
        label {
          @include label;
          color: var(--dark-grey) !important;
          text-transform: capitalize !important;
          flex: 1;
          grid-column: 1/2;
        }
        .custom-select {
          grid-column: 2/3;
          @include custom-select;
          select {
            padding-left: 1em;
          }
        }
        .input {
          grid-column: 2/3;
        }
      }
      .res {
        grid-column: 1/3;
        padding: 1em 0;
        @include flexSpace;
        text-align: center;
        h2 {
          color: var(--dark-grey) !important;
          font-family: var(--open) !important;
          font-weight: normal !important;
          margin: 0 !important;
          text-align: left;
          grid-column: 1/2;
        }
        .input-group {
          @include flexSpace;
          flex-direction: row !important;
          width: 30%;
          input {
            margin: 0.5em 0;
            margin-right: 1em;
          }
          .radio-group {
            @include flexSpace;
            @include center;
            margin-left: -25px;
          }
        }
      }
      .cta {
        grid-column: 2/3;
        justify-self: right;
        align-self: right;
        button {
          @include btn;
          border-radius: 5px;
          background: var(--blue-deep);
          color: var(--white) !important;
        }
      }
    }
    .info {
      grid-column: 1/3;
      @include flex;
      @include center;
      color: var(--blue-deep);
      background: #0080ff6e;
      margin: 0.5em 0;
      padding: 5px;
      border-radius: 2px;
      .icon {
        margin-right: 0.75em;
      }
      span:last-of-type {
        font-size: 13px;
      }
    }
  }
  #tables {
    grid-column: 1/2;
    grid-row: 1;
    margin-right: 10px;
    background: rgba(240, 240, 240, 0.2);
    .table-header {
      padding: 15px 10px;
      background: var(--blue-deep);
      color: var(--white);
      font-weight: bold;
    }

    .table-header,
    .table {
      @include grid;
      grid-template-columns: repeat(5, 1fr);
      .type,
      .number,
      .res {
        text-align: center;
      }
    }
    .table-header {
      span {
        text-transform: capitalize;
      }
      span:last-of-type {
        text-align: right;
      }
    }
    .table {
      padding: 10px;
      border: 0.3px solid #eee;
      background: var(--white);
      border-left: none;
      border-right: none;
      @include relative;

      p {
        text-transform: capitalize;
      }
      .code {
        img {
          width: 100px;
        }
      }
    }
    .first {
      margin-top: 1em;
    }
    .options {
      cursor: pointer;
      align-self: flex-start;
      @include absolute;
      top: 2px;
      right: 10px;
      .tools {
        @include absolute;
        top: 37px;
        right: -35px;
        width: 120px;
        margin: 0 auto;
        background: var(--white);
        z-index: 3;
        border-radius: 2px;
        .edit,
        .delete,
        .print {
          padding: 0.5em 1em;
          cursor: pointer;
          @include flexCol;
          text-transform: capitalize;
        }
        transition: all 0.4s linear;
        @include flexCol;
        @include shadow;
      }
      .options-icon {
        background: var(--secondary);
        color: var(--white);
        padding: 0.5em;
        border-radius: 5px;
        @include flexCenterVariant;
        .material-icons {
          font-size: 20px;
        }
      }
    }
    .active {
      display: flex !important;
      flex-direction: column !important;
    }
  }
  #qrcode-container {
    grid-column: 2/3;
    embed {
      height: 500px;
      width: 100%;
    }
  }
}
</style>
