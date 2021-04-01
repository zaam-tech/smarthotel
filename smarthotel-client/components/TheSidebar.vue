<template>
  <div id="left" :class="{ cashier: isCashier }">
    <div class="close" @click="showNav" v-show="shown">
      <span class="ti ti-close"></span>
    </div>
    <div class="sidebar" :class="{ shown }">
      <div class="brand">
        <nuxt-link to="/dashboard">
          <img src="/logo.svg" alt="app logo" />
        </nuxt-link>
      </div>
      <div class="user">
        <img src="/img_avatar.png" alt="User Image" />
        <div class="msg">
          <p class="msg-text">{{ user }}</p>
          <p class="name">{{ userType }}</p>
        </div>
      </div>
      <div class="links">
        <div class="link-list">
          <div
            v-for="link in Links"
            :key="link.id"
            @click.prevent="activate($event, link)"
            :class="{ active: link.active }"
            class="link"
            :id="link.alias"
            :data-target="link.id"
          >
            <div class="link-inner">
              <span :class="link.iconClass">{{ link.icon }}</span>
              <span :class="link.textCass">{{ link.text }}</span>
              <span
                class="material-icons expand-more"
                v-if="link.subMenu"
                :id="link.id"
                >{{
                  active && active.id === link.id
                    ? 'expand_more'
                    : 'chevron_right'
                }}</span
              >
            </div>
            <div
              class="links-deep"
              v-if="link.subMenu"
              :class="{ show: active && active.id === link.id }"
              :ref="link.id"
            >
              <div
                class="link-deep"
                @click.prevent="activateDeep($event, link)"
                v-for="subLink in link.subMenu"
                :key="subLink.id"
                :id="subLink.id"
                :class="{ active: subLink.active }"
              >
                <span :class="subLink.textCass" class="sub-link">{{
                  subLink.text
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="copyright">
        &copy; 2020
        <a href="www.zaam.com">Zaam Technologies</a>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import { bus } from '../layouts/default'
export default {
  data() {
    return {
      active: null,
      Links: [],
      shown: false,
      user: '',
      userType: '',
    }
  },
  computed: {
    ...mapState(['links']),
    ...mapGetters({
      getCashierLinks: 'links/getCashierLinks',
    }),
    isCashier() {
      return this.userType === 'cashier'
    },
  },
  methods: {
    ...mapActions({
      activateLink: 'links/activateLink',
      selectTab: 'tabs/selectTab',
    }),
    activate(event, activeLink) {
      if (activeLink.subMenu) {
        if (this.active === null) {
          this.active = activeLink
        } else {
          this.active = null
        }
      } else {
        this.activateDeep(event, activeLink)
      }
    },
    activateDeep(event, activeLink) {
      const target = event.target
      if (target.classList.contains('sub-link')) {
        const parent = target.parentElement
        const link = activeLink.subMenu.find((link) => link.id === parent.id)
        if (link) {
          this.activateLink(link)
          bus.$emit('selectLink', link)
        }
      } else if (target.classList.contains('link-deep')) {
        const link = activeLink.subMenu.find((link) => link.id === target.id)
        if (link) {
          this.activateLink(link)
          bus.$emit('selectLink', link)
        }
      } else {
        this.activateLink(activeLink)
        bus.$emit('selectLink', activeLink)
      }
    },
    select(tab) {
      this.selectTab(tab)
    },
    showNav() {
      this.shown = !this.shown
    },
  },
  async mounted() {
    this.Links = this.links.links
    bus.$on('showNav', () => this.showNav())
    if (process.title === 'browser') {
      if (window && window.localStorage) {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
          const userType = user.userType
          this.userType = userType.toLowerCase()
          this.user = user.fullName
        }
        if (this.userType.toLowerCase() === 'cashier') {
          this.Links = this.getCashierLinks
        }
      }
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#left {
  .sidebar {
    border-right: 1px solid #eee;
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 5;
    width: 100%;
    max-width: 250px;
    background: var(--white);
    overflow-y: scroll;
    @include flexCol;
    .user {
      @include flexColCenter;
      margin-bottom: 1em;
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 3px solid var(--white);
      }
    }
    .msg {
      @include flexColCenter;
      @include sans_style;
      margin-top: 1em;
      color: var(--darkBluey);
      p {
        font-family: var(--open);
        letter-spacing: 0.5px;
      }
      .name {
        text-transform: capitalize;
        font-size: 15px;
      }
    }
    .msg-text {
      font-weight: bold;
      color: var(--dark);
      margin-bottom: 10px;
    }
    .links {
      padding: 0;
      .link-list {
        @include flexCol;
        .link {
          padding: 1em 1.2em;
          @include flexCol;
          cursor: pointer;
          border-left: 3px solid transparent;
          border-top: 1px solid transparent;
          border-bottom: 1px solid transparent;
          color: var(--darkVariant);
          font-family: var(--open);
          text-transform: capitalize;
          font-size: 0.95em;
          .link-inner {
            @include flexCenterVariant;
          }
          @include relative;
          .material-icons {
            margin-right: 10px;
            font-size: 20px;
          }
          .expand-more {
            @include absolute;
            top: 13px;
            font-size: 24px;
            right: 10px;
            z-index: 2;
            pointer-events: none;
          }
          .links-deep {
            @include flexCol;
            display: none;
            padding: 1em 0 0 2em;
            .link-deep {
              padding: 0.5em 0;
              border-bottom: 1px solid var(--light_grey);
              animation: hide 0.15s ease backwards;
              span {
                color: var(--darkVariant);
              }
              &:last-of-type {
                border: none;
              }
            }
          }
          .links-deep.show {
            display: flex !important;
            opacity: 1;
            pointer-events: auto;
            animation: show 0.25s ease forwards;
          }
          @keyframes show {
            0% {
              opacity: 0;
              transform: translate(0, 10px) perspective(200px) rotateX(-2deg);
              transition: visibility 0.25s, opacity 0.25s, transform 0.25s;
            }

            100% {
              transform: translate(0, 0);
              opacity: 1;
            }
          }

          @keyframes hide {
            from {
              opacity: 1;
            }

            to {
              opacity: 0;
              transform: translate(0, 10px);
            }
          }
        }
        .link.active {
          color: var(--primary);
          transition: 0.6s all;
          border-left-color: var(--primary);
        }
        .link-deep.active {
          .sub-link {
            color: var(--primary) !important;
            transition: 0.6s all;
            border-left: none;
          }
        }
        .link:nth-child(8),
        .link:nth-child(10) {
          @include relative;
          padding: 1.2em 1.2em;
          margin-top: 0.2em;
          &:before {
            @include absolute;
            content: '';
            width: 80%;
            left: 20%;
            top: 0;
            transform: translateX(-20%);
            background: rgba(0, 0, 0, 0.15);
            height: 1px;
          }
        }
      }
    }
    .brand {
      padding: 1rem;
      a {
        color: var(--dark);
        .brand-name {
          @include h2_variant;
          color: var(--dark);
          font-weight: bold;
        }
        @include flexCenterBoth;
        img {
          width: 200px;
        }
      }
      .material-icons {
        margin-right: 0.25em;
        font-size: 2.5em;
      }
    }
  }
}
.cashier #manage {
  .links-deep {
    .link-deep:last-of-type {
      display: none !important;
    }
  }
}
@media screen and (max-width: 1050px) {
  .brand {
    margin-bottom: 1rem;
  }
}
.close {
  display: none;
}
@media screen and (max-width: 800px) {
  #left {
    .sidebar {
      display: none !important;
      top: 0;
      left: 0;
      right: 0;
      z-index: 141;
      max-width: 300px;
      overflow-y: auto;
      height: auto !important;
      box-shadow: 0 50px 100px rgba(50, 50, 93, 0.1),
        0 15px 35px rgba(50, 50, 93, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1);
      background: var(--white);

      .brand {
        width: 90%;
        @include relative;
        &::after {
          @include absolute;
          bottom: 0;
          left: 5%;
          content: '';
          background: rgba(0, 0, 0, 0.1);
          height: 1px;
          width: 100%;
        }
      }
      .links {
        padding-bottom: 1em;
      }
    }
    .close {
      @include absolute;
      top: 30px;
      right: 20px;
      @include flex;
      cursor: pointer;
      z-index: 150;
      color: var(--darkVariant);
    }
  }
  #left {
    .sidebar.shown {
      display: flex !important;
      flex-direction: column;
      transition: ease-in 2s;
    }
  }
}
.copyright {
  transform: translateY(100%);
  width: 100%;
  padding: 1em 0.5em;
  font-family: var(--open);
  border-top: 1px solid var(--light_grey);
  color: var(--darkBluey);
  text-align: center;
}
</style>
