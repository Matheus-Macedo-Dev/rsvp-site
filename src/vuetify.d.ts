declare module 'vuetify' {
  import type { App } from 'vue'
  const createVuetify: any
  export { createVuetify }
}

declare module 'vuetify/components' {
  const components: any
  export = components
}

declare module 'vuetify/directives' {
  const directives: any
  export = directives
}

declare module 'vuetify/iconsets/mdi' {
  export const aliases: any
  export const mdi: any
}
