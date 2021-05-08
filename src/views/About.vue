<template>
  <div class="about">
    <h1>This is an about page</h1>
    <ul>
      <li>
        <router-link to="/about/a">to a</router-link>
      </li>
      <li>
        <router-link to="/about/b">to b</router-link>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>
