<template>
  <div id="faq" :style="{ transform: 'translateY(' + absoluteValue + 'px)' }">
    <h1>FAQ</h1>
    <div class="list" v-for="question in questions" :key="question.id">
      <div class="heading">
        <span
          class="material-icons"
          @click="openAnswer(question)"
          :class="{ open: active && active.id === question.id }"
          >chevron_right</span
        >
        <span class="question">{{ question.text }}</span>
      </div>
      <div
        class="content"
        :class="{ open: active && active.id === question.id }"
      >
        <span>{{ question.ans }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
export default {
  props: {
    absoluteValue: {
      type: Number,
    },
    questions: {
      type: Array,
    },
  },
  data() {
    return {
      active: null,
      open: false,
    }
  },
  methods: {
    openAnswer(question) {
      this.open = !this.open
      if (this.active === null) {
        this.active = question
      } else {
        this.active = null
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#faq {
  border: 1px solid #f0f0f0;
  width: 35%;
  font-family: var(--rob);
  h1 {
    padding: 1em 0.5em;
    border-bottom: 1px solid #f0f0f0;
    color: var(--darkVariant);
    font-family: var(--source);
  }
  .list {
    @include flexCol;
    padding: 0.75em;
    border-bottom: 1px solid #f0f0f0;
    .heading {
      @include flex;
      @include center;
      margin-bottom: 0.5em;
      .material-icons {
        cursor: pointer;
      }
      .material-icons.open {
        transition: all 0.3s linear;
        transform: rotate(90deg);
      }
      .question {
        color: var(--secondary);
      }
    }
    .content {
      display: none;
      padding-left: 1.5em;
    }
    .content.open {
      transition: all 0.3s linear;
      @include flexCol;
    }
  }
  .list:last-of-type {
    border: none;
  }
  @media screen and (max-width: 768px) {
    width: 40%;
    top: 4.5%;
  }
}
</style>
