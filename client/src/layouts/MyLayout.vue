<template>
  <q-layout view="hhh lpr fff">

    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img :src="'statics/Police-logo-240.png'" height="60px">
          </q-avatar>
          <div>Police Broadcast and BOLOs</div>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left"
              v-model="tab"
              dense
              active-color="white"
              indicator-color="white"
              narrow-indicator>
        <q-route-tab to="/" label="Broadcasts" name="broadcasts" />
        <q-route-tab to="/bolos" label="BOLOs" name="bolos" />
        <q-route-tab to="/management" label="management" name="management" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      socket: this.$socket,
      tab: 'broadcasts'
    }
  },
  methods: {
    openURL
  },
  mounted () {

  }
}
</script>

<style>
</style>
