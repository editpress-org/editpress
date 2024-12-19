<!--
 @design by @veaba
 -->
<template>
  <div class="editable-loading" v-if="loading">
    <div class="editable-storm-loading"></div>
  </div>
</template>
<script>
import bus from "../eventBus";
export default {
  name: "EditableLoading",
  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    bus.$on("showLoading", (status) => {
      this.loading = status;
    });
  },
};
</script>

<style scoped>
.editable-loading {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: #282c34ba;
}
.editable-loading p {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #2e4f48;
  font-size: 24px;
}

.editable-storm-loading {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.22);
  transition: all 3s;
}

.editable-storm-loading:before {
  position: absolute;
  content: "";
  width: 20px;
  height: 20px;
  border-top: 4px solid rgba(62, 175, 124, 0.85);
  border-left: 4px solid rgba(62, 175, 124, 0.8);
  border-right: 4px solid rgba(62, 175, 124, 0.75);
  border-bottom: 4px solid rgba(62, 175, 124, 0.7);
  border-radius: 100%;
  margin-left: -30px;
  -webkit-animation: storm-loading 1s linear infinite;
  -o-animation: storm-loading 1s linear infinite;
  animation: storm-loading 1s linear infinite;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
}
.editable-storm-loading:after {
  position: relative;
  content: "Loading...";
  color: rgb(62, 175, 124);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  padding-left: 10px;
  font-size: 16px;
}
/*animation*/
@keyframes storm-loading {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-webkit-keyframes storm-loading {
  0% {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>