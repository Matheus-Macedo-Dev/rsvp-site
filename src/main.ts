import { createApp } from 'vue'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import './style.css'
import App from './App.vue'

// Add Google Fonts
const playfairLink = document.createElement('link')
playfairLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap'
playfairLink.rel = 'stylesheet'
document.head.appendChild(playfairLink)

// Add Silk Serif font (if using Adobe Fonts or similar service)
// Note: You may need to add the actual font URL or upload font files
const silkSerifLink = document.createElement('link')
silkSerifLink.href = 'https://fonts.cdnfonts.com/css/silk-serif'
silkSerifLink.rel = 'stylesheet'
document.head.appendChild(silkSerifLink)

const vuetify = createVuetify({
  components,
  directives,
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
          success: '#4caf50',
          warning: '#ff9800',
        },
      },
    },
  },
})

const app = createApp(App)
app.use(vuetify)
app.mount('#app')