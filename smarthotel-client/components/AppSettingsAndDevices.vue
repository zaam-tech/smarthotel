<template>
  <div id="print-settings">
    <div id="tabs">
      <div
        class="tab"
        v-for="tab in settingsTabs"
        :key="tab.id"
        :class="{ active: tab.active }"
        @click="activateTab(tab.id)"
      >
        {{ tab.text }}
      </div>
    </div>
    <div id="printer-form">
      <form>
        <div
          class="form-group group-1"
          :class="{ 'invalid-field': workstation.error }"
        >
          <label>Workstation</label>
          <div class="custom-select">
            <select
              v-model="workstation.model"
              :class="{
                invalid: workstation.error,
              }"
            >
              <option
                :value="option.text"
                v-for="option in options"
                :key="option.id"
              >
                {{ option.text }}
              </option>
            </select>
            <span class="custom-arrow"></span>
          </div>
        </div>
        <div
          class="form-group group-2"
          :class="{ 'invalid-field': printerName.error }"
        >
          <label>Printer name</label>
          <input
            type="text"
            class="input"
            name="printerName"
            v-model="printerName.model"
            :class="{
              invalid: printerName.error,
            }"
          />
          <p class="error" v-show="printerName.error">
            <span>{{ printerName.error }}</span>
          </p>
        </div>
        <div
          class="form-group group-3"
          :class="{ 'invalid-field': paperSize.error }"
        >
          <label>Paper size</label>
          <div class="custom-select">
            <select
              v-model="paperSize.model"
              :class="{
                invalid: paperSize.error,
              }"
            >
              <option
                :value="option.text"
                v-for="option in options"
                :key="option.id"
              >
                {{ option.text }}
              </option>
            </select>
            <span class="custom-arrow"></span>
          </div>
        </div>
        <div
          class="form-group group-4"
          :class="{ 'invalid-field': print.error }"
        >
          <label>Print document</label>
          <div class="custom-select">
            <select
              v-model="print.model"
              :class="{
                invalid: print.error,
              }"
            >
              <option
                :value="option.text"
                v-for="option in options"
                :key="option.id"
              >
                {{ option.text }}
              </option>
            </select>
            <span class="custom-arrow"></span>
          </div>
        </div>
        <div
          class="form-group group-5"
          :class="{ 'invalid-field': printerStatus.error }"
        >
          <label>Printer status</label>
          <div class="custom-select">
            <select
              v-model="printerStatus.model"
              :class="{
                invalid: printerStatus.error,
              }"
            >
              <option
                :value="option.text"
                v-for="option in options"
                :key="option.id"
              >
                {{ option.text }}
              </option>
            </select>
            <span class="custom-arrow"></span>
          </div>
        </div>
        <div
          class="form-group group-6"
          :class="{ 'invalid-field': copies.error }"
        >
          <label>Copies</label>
          <input
            type="text"
            class="input"
            name="copies"
            v-model="copies.model"
            :class="{
              invalid: copies.error,
            }"
          />
          <p class="error" v-show="copies.error">
            <span>{{ copies.error }}</span>
          </p>
        </div>
        <div
          class="form-group group-7"
          :class="{ 'invalid-field': printStation.error }"
        >
          <label>Print Station</label>
          <div class="custom-select">
            <select
              v-model="printStation.model"
              :class="{
                invalid: printStation.error,
              }"
            >
              <option
                :value="option.text"
                v-for="option in options"
                :key="option.id"
              >
                {{ option.text }}
              </option>
            </select>
            <span class="custom-arrow"></span>
          </div>
        </div>
        <div
          class="form-group group-8"
          :class="{ 'invalid-field': preview.error }"
        >
          <label>Preview</label>
          <div class="custom-select">
            <select
              v-model="preview.model"
              :class="{
                invalid: preview.error,
              }"
            >
              <option
                :value="option.text"
                v-for="option in options"
                :key="option.id"
              >
                {{ option.text }}
              </option>
            </select>
            <span class="custom-arrow"></span>
          </div>
        </div>
        <div class="button">
          <button class="btn">Save</button>
        </div>
      </form>
    </div>
    <div id="printer-list">
      <div class="header">
        <h3 class="item-name-header">Workstation</h3>
        <h3 class="document-name-header">Document</h3>
        <h3 class="station-header">Print Station</h3>
        <h3 class="printer-name-header">Printer Name</h3>
        <h3 class="status-header">Status</h3>
        <h3 class="print-preview-header">Print Preview</h3>
        <h3 class="paper-size-header">Paper Size</h3>
        <h3 class="copies-header">Copies</h3>
        <h3 class="action-header">Action</h3>
      </div>
      <div class="printer-list">
        <div class="item" v-for="item in deviceList" :key="item.id">
          <p class="name">{{ item.name }}</p>
          <p class="document">{{ item.printDocument }}</p>
          <p class="station">{{ item.printStation }}</p>
          <p class="printer-name">{{ item.printerName }}</p>
          <p class="status">
            {{ item.status ? 'on' : 'off' }}
          </p>
          <p class="preview">
            {{ item.preview }}
          </p>
          <p class="paper-size">
            {{ item.paperSize }}
          </p>
          <p class="copies">
            {{ item.copies }}
          </p>
          <div class="action">
            <span
              class="material-icons options-icon"
              @click="showOptions($event)"
              v-on-clickaway="hideOptions"
              >more_vert</span
            >
            <div
              class="tools"
              v-show="active === item._id" :id="active"
            >
              <div class="edit">
                <span @click="editItem(item)">edit</span>
              </div>
              <div class="delete">
                <span @click="deleteItem(item._id)">delete</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 } from 'uuid'
import { mapState, mapGetters, mapActions } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
export default {
  mixins: [clickaway],
  data: () => ({
    active: null,
    workstation: {
      error: '',
      model: '',
    },
    printerName: {
      error: '',
      model: '',
    },
    paperSize: {
      error: '',
      model: null,
    },
    print: {
      error: '',
      model: '',
    },
    printerStatus: {
      error: '',
      model: '',
    },
    copies: {
      error: '',
      model: null,
    },
    printStation: {
      error: '',
      model: '',
    },
    preview: {
      error: '',
      model: '',
    },
    options: [
      {
        id: v4(),
        text: 'first',
      },
      {
        id: v4(),
        text: 'second',
      },
      {
        id: v4(),
        text: 'third',
      },
      {
        id: v4(),
        text: 'fourth',
      },
    ],
  }),
  computed: {
    ...mapState(['settings']),
    deviceList() {
      return this.settings.devices
    },
    ...mapGetters({
      settingsTabs: 'tabs/settingsTabs',
    }),
  },
  methods: {
    ...mapActions({
      selectTab: 'tabs/selectTab',
    }),
    activateTab(tabId) {
      this.selectTab(tabId)
    },
    editItem(item) {},
    deleteItem(item) {},
    hideOptions(event) {
      const { target } = event
      if(!target.classList.contains('options-icon') &&
         !target.classList.contains('text') &&
         !target.classList.contains('material-icons')){
          this.removeClass()
         }
    },
    removeClass(){
      const tools = document.querySelectorAll('.tools.active')
      tools.forEach(tool => {
        tool.classList.remove('active')
      })
    },
    showOptions(event) {
      const { target } = event
      this.removeClass()
      if(target.classList.contains('options-icon')){
        target.nextElementSibling.classList.add('active')
      }else {
        target.parentElement.nextElementSibling.classList.add('active')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#print-settings {
  @include grid;
  margin-top: 4em;
  padding: 1em;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 70px repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  #tabs {
    grid-column: 1/13;
    @include flexCenterBoth;
    .tab {
      padding: 1em 1.5em;
      text-transform: uppercase;
      background: #cfd0d18c;
      border: 1px solid #cfd0d18c;
      @include relative;
      cursor: pointer;
      transition: 0.3s;
      font-size: 15px;
      &::after {
        content: '';
        width: 100%;
        transform: scale(0);
        height: 2px;
        top: 0;
        left: 0;
        position: absolute;
        transform-origin: center;
        transition: 0.3s;
        background: var(--primary);
      }
    }
    .tab.active {
      background: transparent;
      border-top-color: transparent;
      border-bottom-color: transparent;
      color: var(--primary);
      &::after {
        transform: scale(1);
      }
    }
  }
  #printer-form {
    background: var(--white);
    grid-column: 1/13;
    form {
      @include grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      .group-1,
      .group-4,
      .group-7 {
        grid-column: 1/2;
      }
      .group-2,
      .group-5,
      .group-8 {
        grid-column: 2/3;
      }
      .group-3,
      .group-6 {
        grid-column: 3/4;
      }
      .button {
        @include flex;
        align-items: flex-end;
        justify-content: flex-end;
        grid-column: 3/4;
        padding: 1em;
        .btn {
          @include btn;
          width: 183px;
        }
      }
      .form-group {
        @include flexCenterVariant;
        flex-wrap: wrap;
        padding: 1em;
        label {
          @include label;
          text-transform: uppercase !important;
          font-size: 14px;
          flex: 1;
        }
        .input {
          color: #333;
          border-radius: 2px;
          border: 1px solid var(--grey);
          font-family: var(--open);
          font-size: 15px;
          flex: 1.3;
          max-width: 183px;
          height: 28px !important;
          &:active,
          &:focus {
            outline: none;
          }
        }
        .custom-select {
          flex: 1.3;
          max-width: 183px;
          @include custom-select-variant;
          height: 28px !important;

          .custom-arrow {
            top: 5%;
            height: 26px;
            right: 0;
            border-right: 1px solid var(--grey);
            background: var(--grey);
            &::after {
              left: 20%;
            }
          }
          select {
            height: 28px !important;
            background: var(--white);
            padding-left: 0 !important;
            margin-top: 0;
          }
        }
      }
    }
  }
  #printer-list {
    grid-column: 1/13;
    h3 {
      font-weight: bold;
    }
    .header,
    .item {
      @include grid;
      grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
      background: var(--grey);
      text-transform: uppercase;
      font-size: 13px;
      padding: 0.75em;
      @include relative;
      .item-name-header,
      .item {
        grid-column: 1/2;
      }
      .document-name-header,
      .document {
        grid-column: 2/3;
      }
      .station-name-header,
      .station {
        grid-column: 3/4;
      }
      .printer-name-header,
      .printer {
        grid-column: 4/5;
      }
      .status-header,
      .status {
        grid-column: 5/6;
      }
      .print-preview-header,
      .print-preview {
        grid-column: 6/7;
      }
      .paper-size-header,
      .paper-size {
        grid-column: 7/8;
      }
      .copies-header,
      .copies {
        grid-column: 8/9;
      }
      .action-header,
      .action {
        grid-column: 9/10;
        align-self: flex-start;
        @include absolute;
        top: 10px;
        right: 10px;
        .material-icons {
          cursor: pointer;
          font-size: 25px;
        }
        .tools {
          @include absolute;
          top: 25px;
          right: 10px;
          width: 120px;
          margin: 0 auto;
          background: var(--white);
          z-index: 3;
          border-radius: 2px;
          .edit,
          .delete,
          .print {
            padding: 0.5em 1em;
            text-align:left;
            font-size:16px;
            cursor: pointer;
            @include flexCenterBoth;
            text-transform: capitalize;
          }
          transition: all 0.4s linear;
          @include flexCol;
          @include shadow;
        }
        .active{
          display: flex !important;
          flex-direction:column !important;
        }
      }
    }
    .item {
      padding: 1em;
      margin: 10px 0;
    }
  }
}
</style>
