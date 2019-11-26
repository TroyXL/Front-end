const Router = {
  install (Vue, options) {
    Vue.component('router', {
      props: {
        to: {
          type: [ String, Object ],
          required: true
        }
      },
      created () {

      },
      template: `
        <a :href="'#' + to">this is a router</a>
      `,
      
    })

    console.log(window.location.hash)


  }
}