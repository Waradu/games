<template>
  <div class="page">
    <Header />
    <NuxtPage />
  </div>
</template>

<style lang="scss">
@font-face {
  font-family: commitMono;
  src: url("~/assets/joystix.otf") format("opentype");
  font-display: swap;
}

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
  background-color: $background;
  color: white;
  font-family: commitMono, monospace;
  cursor: $cursor_normal;
  overflow: hidden;
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
  flex-direction: column;
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
