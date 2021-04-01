<template>
  <div id="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-item" @click="showMyAccount">
        <md-contact-icon class="dropdown-icon" />
        <span>My account</span>
      </div>
      <div class="dropdown-item">
        <span class="material-icons">help</span>
        <span>Support</span>
      </div>
      <div class="dropdown-item" @click="logout">
        <md-log-out-icon class="dropdown-icon" />
        <span>Logout</span>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { bus } from '../layouts/default'
import redirect from '../utilities/redirect'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      links: [
        {
          alias: 'user',
          id: uuidv4(),
          icon: 'account_circle',
          text: 'My profile',
        },
        {
          alias: 'support',
          id: uuidv4(),
          icon: 'help',
          text: 'Support',
        },
        {
          alias: 'logout',
          id: uuidv4(),
          icon: 'power',
          text: 'Logout',
        },
        {
          alias: 'delete_account',
          id: uuidv4(),
          icon: 'delete',
          text: 'Delete Account',
        },
      ],
    }
  },
  methods: {
    ...mapActions({
      logoutUser: 'auth/logout',
    }),
    async logout() {
      if (process.title === 'browser') {
        try {
          await this.logoutUser()
          redirect('/')
        } catch (error) {
          bus.$emit('showPopup', {
            message: `${error.message}`,
            success: false,
          })
        }
      }
    },
    showMyAccount() {
      bus.$emit('selectLink', {
        alias: 'my-account',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#dropdown {
  @include absolute;
  right: -100px;
  top: 2.5em;
  width: 15rem;
  z-index: 1000;
  .dropdown-menu {
    width: 12rem;
    border-radius: 5px;
    background: var(--white);
    @include shadowVariant;
    @include flexCol;
    .dropdown-item {
      padding: 0.3em 1.2em;
      margin: 0.5em 0;
      @include center;
      @include flex;
      cursor: pointer;
      .material-icons {
        color: var(--dark);
        margin-right: 10px;
      }
      .dropdown-icon {
        margin-right: 10px;
        font-size: 24px;
      }
    }
  }
  .show {
    opacity: 1;
    pointer-events: auto;
    animation: show-navbar-dropdown 0.25s ease forwards;
  }

  .close {
    display: block;
    animation: hide-navbar-dropdown 0.15s ease backwards;
  }
  @keyframes show-navbar-dropdown {
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

  @keyframes hide-navbar-dropdown {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      transform: translate(0, 10px);
    }
  }
}
</style>
