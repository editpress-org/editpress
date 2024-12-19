<template>
  <div
    v-if="eventData.status"
    class="editable-review"
    :style="{
      'z-index': this.eventData.status ? 2 : -1,
    }"
  >
    <div class="editable-review-warp">
      <Position :lines="breakLines"></Position>
      <!-- TODO: Get English version content-->
      <div class="editable-review-code">
        <div class="editable-new-code editable-review-body">
          <p>
            Powered by
            <a
              href="https://github.com/editpress-org/editpress/"
              target="_blank"
            >
              vuepress-plugin-editable
            </a>
            and
            <a href="https://github.com/veaba/veaba-bot/" target="_blank">
              veaba-bot
            </a>
          </p>
          <!-- `<pre>` elements and content are not on the same line, there will be indentation problems.-->
          <pre
            class="editable-new-content"
            contenteditable="true"
            @input="onChange"
            >{{ eventData.content }}</pre
          >
          <!-- btn -->
          <div class="editable-review-btn">
            <button @click="onApplyPullRequest" :disabled="disabled">
              应用(Apply)
            </button>
            <button @click="closeModal">关闭(Close)</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "../eventBus";
import { fetchOps } from "../fetchConfig";
import Position from "./Position";

export default {
  mounted() {
    this.originContentLine = this.countOriginContent(this.eventData.content);
    bus.$on("showReview", (data) => {
      this.eventData = data;
      this.originContentLine = this.countOriginContent(data.content);
      this.bodyScrollDefaultValue = this.switchBodyScroll();
    });
  },
  components: { Position },
  data() {
    return {
      eventData: {
        content: "",
        status: false,
      },
      disabled: false,
      originContentLine: 0,
      otherDivLine: 0,
      bodyScrollDefaultValue: "",
    };
  },
  computed: {
    breakLines() {
      return this.originContentLine + this.otherDivLine;
    },
  },
  methods: {
    /**
     * disabled body scroll
     * @param {boolean} true | false
     */
    switchBodyScroll(isReset) {
      const body = document.querySelector("body");
      const tempOverflowValue = body.style.overflow;
      if (isReset) {
        body.style.overflow = this.bodyScrollDefaultValue;
        this.$nextTick(() => {
          this.bodyScrollDefaultValue = "";
        });
      } else {
        body.style.overflow = "hidden";
      }
      return tempOverflowValue;
    },
    countOriginContent(nodeOrContent, isNode) {
      let lines = 0;
      if (nodeOrContent) {
        let text = "";
        if (isNode) {
          text = nodeOrContent.textContent;
        } else {
          text = nodeOrContent;
        }
        for (let i in text) {
          if (text[i] === "\n") lines++;
        }
      }
      return lines;
    },
    closeModal() {
      location.reload();
    },
    debounce(fn, wait) {
      let timer = 0;
      return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(this, args);
        }, wait);
      };
    },
    /**
     * contenteditable input event generate div element
     */
    onChange(event) {
      this.otherDivLine = (event.target.children || []).length;
      const firstTextNode = event.target.childNodes[0];
      const w = this;
      this.debounce(() => {
        if (firstTextNode === undefined) w.originContentLine = 1;
        w.originContentLine = w.countOriginContent(firstTextNode, true);
      }, 100)();
    },
    /**
     * apply pull request
     */
    onApplyPullRequest() {
      this.disabled = true;
      const contentNode = document.querySelector(".editable-new-content");
      const content = contentNode && contentNode.innerText;
      bus.$emit("showLoading", true);
      const { updateAPI } = this.$page.$editable || {};
      fetch(updateAPI, {
        body: JSON.stringify({
          owner: this.eventData.owner,
          repo: this.eventData.repo,
          path: this.eventData.path,
          content: content,
        }),
        method: "POST",
        ...fetchOps,
        headers: new Headers({
          "Access-Token": sessionStorage.githubOAuthAccessToken,
          'Github-Login': sessionStorage.githubLogin,
          "Content-Type": "Application/json",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          this.disabled = false;
          if (data.success) {
            this.eventData.status = false;
            setTimeout(() => {
              location.reload();
            }, 5000);
          }
          this.switchBodyScroll();
          bus.$emit("showLoading", false);
          bus.$emit("onReceive", data, true);
        })
        .catch(() => {
          bus.$emit("showLoading", false);
          this.switchBodyScroll();
        });
    },
  },
};
</script>

<style lang="stylus" scoped>
.editable-review {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}
</style>
