import { createApp } from 'vue'
// Vuetify
import 'vuetify/dist/vuetify.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import './style.css'
import App from './App.vue'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#42b883',
          secondary: '#35495e',
        },
      },
    },
  },
})

const app = createApp(App)
app.use(vuetify)
app.mount('#app')
