<template>
  <div class="hello">
    <input type="number" :value="app.num" @blur="setValue" />
    <div>
      <button class="btn" @click="add">+</button>
      <button class="btn" @click="less">-</button>
      <br />
      <button class="btn" @click="cancel">撤销</button>
      <button class="btn" @click="uncancel">反撤销</button>
    </div>
  </div>
</template>
s
<script lang="ts">
import Vue from "vue";
import { cancelHistory, unCancelHistory } from "@/store/plugins/index";
import history from "@/store/plugins/history";
import { mapState } from "vuex";
export default Vue.extend({
  name: "HelloWorld",
  props: {
    msg: String
  },
  computed: {
    ...mapState({
      app: "app"
    })
  },
  methods: {
    add() {
      this.$store.commit("app/ADD_NUM");
    },
    less() {
      this.$store.commit("app/LESS_NUM");
    },
    setValue(e: any) {
      this.$store.commit("app/SET_NUM", Number(e.target.value));
    },
    cancel() {
      cancelHistory();
    },
    uncancel() {
      unCancelHistory();
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
