<!-- Poptip -->

<template>
  <div v-if="status" class="editable-poptip" :style="{ borderColor }">
    <div>
      <strong>{{ res.success ? "Successful！" : "Warning! " }} </strong>

      <span class="close-poptip" @click="closePoptip">x</span>
    </div>
    <div v-if="!res.success">
      <p>
        message: <code class="code">{{ subMessage(res.message) }}</code>
      </p>
    </div>
    <div v-else>
      See:
      <a :href="res.data && res.data.html_url" target="_blank">
        Pull Request
      </a>
    </div>
    <!-- fork the repo first tip -->
     <div v-if="!res.success && res?.not_found_repo_link">
      See:
      <a :href="res.data && res?.not_found_repo_link" target="_blank">
        {{res.data?.repo}}
      </a>
     </div>
  </div>
</template>
<script>
import bus from "../eventBus";
export default {
  data() {
    return {
      borderColor: "#ddd",
      res: {
        success: true,
        data: "",
        message: "",
      },
      status: false,
    };
  },
  mounted() {
    bus.$on("onClose", () => {
      this.status = false;
    });
    bus.$on("onReceive", (json = {}, status) => {
      const { success, data, message } = json;
      this.res = {
        success,
        data,
        message,
      };

      this.status = status;
      if (success) {
        this.borderColor = "#3eaf7c";
      } else {
        this.borderColor = "#eb7350";
      }
    });
  },
  methods: {
    closePoptip() {
      this.status = false;
      if (!this.res.success) {
        location.reload();
      }
    },
    subMessage(str) {
      return (str || "").replace(/^.*: /g, "");
    },
  },
};
</script>

<style scoped>
.close-poptip {
  position: relative;
  float: right;
  width: 20px;
  height: 20px;
  border: 1px solid #3eaf7c;
  color: #3eaf7c;
  border-radius: 50%;
  text-align: center;
  line-height: 15px;
  cursor: pointer;
  z-index: 1;
}
.editable-poptip {
  position: fixed;
  border: 1px solid #3eaf7c;
  box-sizing: border-box;
  background: #fff;
  width: 360px;
  bottom: 40px;
  right: 40px;
  padding: 20px;
  z-index: 3;
}
.editable-poptip code {
  color: #476582;
  padding: 0.25rem 0.5rem;
  margin: 0;
  font-size: 0.85em;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
}
</style>