<template>
  <div class="hello">
    <input type="number" :value="num" @blur="setValue" />
    <div>
      <button class="btn" @click="add">+</button>
      <button class="btn" @click="less">-</button>
      <button class="btn" @click="cancel">撤销</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import app from "@/store/modules/app";
// import { cancelHistory } from "@/store/plugins/index";
import history from "@/store/plugins/history";
export default Vue.extend({
  name: "HelloWorld",
  props: {
    msg: String
  },
  computed: {
    num() {
      return app.state.num;
    }
  },
  methods: {
    add() {
      this.$store.commit("SET_NUM", this.num + 1);
    },
    less() {
      this.$store.commit("SET_NUM", this.num - 1);
    },
    setValue(e: any) {
      this.$store.commit("SET_NUM", e.target.value);
    },
    cancel() {
      // cancelHistory();
      history.undo();
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn {
  padding: 5px 20px;
  margin: 10px 20px;
}
</style>
