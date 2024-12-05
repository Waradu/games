<template>
  <NuxtLink to="/games/test">TEST</NuxtLink>
  <div class="drops">
    <div class="drop">
      <Card card="2" type="Spades" />
    </div>
    <div class="drop"></div>
    <div class="drop"></div>
    <div class="drop"></div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss">
.drops {
  display: flex;
  margin: 20px;
  gap: 10px;

  .drop {
    width: 100px;
    height: 160px;
    background-color: $foreground;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
