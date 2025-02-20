export default defineAppConfig({
  ui: {
    primary: 'dodger-blue', /* currently not work: Bug: https://volta.net/nuxt/ui/issues/2007 */
    container: {
      constrained: 'max-w-2xl',
    },
    button: {
      variant: {
        link: 'underline hover:no-underline',
      },
    },
  },
})
