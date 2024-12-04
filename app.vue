<template>
  <div class="page">
    <NuxtPage />
  </div>
</template>

<style lang="scss">
@font-face {
  font-family: commitMono;
  src: url("~/assets/joystix.otf") format("opentype");
  font-display: swap;
}

$cursor_normal: url("~/assets/cursor/normal.png") 1 1, auto;
$cursor_pointer: url("~/assets/cursor/pointer.png") 8 12, auto;
$cursor_hold: url("~/assets/cursor/hold.png") 8 12, auto;
$cursor_deny: url("~/assets/cursor/deny.png") 1 1, auto;

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body,
#__nuxt {
  width: 100%;
  height: 100%;
  background-color: #0a0a0a;
  color: white;
  font-family: commitMono, monospace;
  cursor: $cursor_normal;
}

a {
  color: inherit;
  text-decoration: none;
  cursor: $cursor_pointer;
}

input {
  color: inherit;
  font-family: inherit;
}

.page {
  width: 100%;
  height: 100%;
  display: flex;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgb(40, 40, 40);
  -webkit-transition: 0.2s;
  transition: 0.2s;
}

::-webkit-scrollbar-thumb:hover {
  background: rgb(25, 25, 25);
}
</style>
