<template>
  <footer>
    <div id="footer-top">
      <div class="top-col">
        <div class="about col">
          <div class="about-top">
            <h1>About</h1>
            <p>
              Complete World class suite for hospitality management platform
              that helps your business lead in the hospitality services world.
            </p>
          </div>
        </div>
        <div class="links col">
          <h2>Using smarthotel</h2>
          <ul>
            <li>
              <nuxt-link to="/faq">FAQ</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/events">Events</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/programs">Programs</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/resources">Other Resources</nuxt-link>
            </li>
          </ul>
        </div>
        <div class="links col">
          <h2>Smart hotel</h2>
          <ul>
            <li>
              <nuxt-link to="/login">Login</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/help-pages">Help Pages</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/forum">Smarthotel forum</nuxt-link>
            </li>
          </ul>
        </div>
        <div class="col contact">
          <h1>Contact</h1>
          <div class="contact-item">
            <md-locate-icon class="ion-icon" />
            <span>11011-00100 Nairobi GPO</span>
          </div>
          <div class="contact-item">
            <md-mail-icon class="ion-icon" />
            <span>zaamtechnologies@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
    <div id="footer-bottom">
      <div class="bottom-col">
        <div class="logo">
          <h1>Zaam Technologies</h1>
        </div>
        <ul class="links-bottom">
          <li>
            <a href="#">Terms of Service</a>
          </li>
          <li>
            <a href="#">Privacy Policy</a>
          </li>
        </ul>
        <div class="copyright">
          Copyright &copy; {{ date }} Zaam Technologies  . All Rights
          Reserved
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      socials: 'social/socials',
    }),
    date() {
      return new Date().getFullYear()
    },
    isLoaded() {
      if (this.socials && this.socials.length) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
footer {
  color: var(--light_grey);
  a {
    font-family: var(--open);
  }
  @include flexCol;
  #footer-top,
  #footer-bottom {
    padding: 1em 8em;
  }
  #footer-top {
    background: var(--darkVariant);
  }
  #footer-bottom {
    background: var(--dark);
  }
  .top-col {
    @include flexCenter;
    padding: 1.5em 0;
    .about {
      @include flexCol;
      width: 40%;
      margin-left: 0 !important;
      p {
        font-size: 1em;
        line-height: 1.4;
      }
    }
    .links {
      margin-left: 1em;
      width: 30%;
    }
    .col {
      margin: 0 1.5em;
    }
    .contact {
      width: 30%;
      .contact-item {
        margin: 0.5em 0;
        @include flexCenterVariant;
        .ion-icon {
          margin-right: 1em;
        }
      }
    }
  }
  h1 {
    color: var(--white);
    font-family: var(--open);
    font-size: 1.5em;
    margin-bottom: 1.5em;
  }
  h2 {
    color: var(--white);
    font-family: var(--open);
    font-weight: bold;
    font-size: 1.5em;
    margin-bottom: 1.5em;
  }
  ul {
    @include flexCol;
    li {
      margin: 0.3em 0;
      a {
        color: #a6aac9;
        text-transform: capitalize;
        &:hover {
          color: var(--white);
        }
      }
    }
  }
  .bottom-col {
    @include flexSpace;
    @include center;
    padding: 0.75em 0;
    .logo {
      h1 {
        margin-bottom: 0;
      }
    }
    .links-bottom {
      flex-direction: row !important;
      li:last-of-type {
        margin-left: 1em;
      }
    }
    .socials {
      @include flex;
      a {
        width: 20px;
        height: 20px;
        margin: 0 0.4em;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  @media screen and (max-width: 1100px) {
    #footer-top,
    #footer-bottom {
      padding: 1em 10em;
    }
  }
  @media screen and (max-width: 768px) {
    #footer-top,
    #footer-bottom {
      padding: 1em 5em;
    }
    .top-col {
      @include flexColCenter;
      .col {
        width: 100%;
        margin: 1em 0;
      }
    }
  }
  @media screen and (max-width: 807px) {
    .bottom-col {
      @include flexCol;
      .socials {
        margin-top: 1em;
        a:first-of-type {
          margin-left: 0;
        }
        a {
          margin: 0 0.7em;
        }
      }
    }
  }
}
</style>
