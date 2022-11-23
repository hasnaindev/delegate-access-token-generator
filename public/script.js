(async () => {
  const app = new Vue({
    el: '#app',
    data: {
      isLoading: false,
      popupError: '',
      popupContent: '',
      storeName: '',
      adminApiAccessToken: ''
    },
    methods: {
      handleSubmit () {
        if (this.isLoading) return

        this.isLoading = true

        this.generateDelegateAccessToken()
          .then(({ delegateAccessToken }) => {
            this.popupContent = delegateAccessToken
          })
          .catch((error) => {
            console.error(error.message)
            this.popupError = error.message
          })
          .finally(() => {
            this.isLoading = false
          })
      },
      handleClosePopupError () {
        this.popupError = ''
      },
      handleClosePopupContent () {
        navigator.clipboard.writeText(this.popupContent)
        this.popupContent = ''
      },
      async generateDelegateAccessToken () {
        const { storeName, adminApiAccessToken } = this

        try {
          const response = await axios.post('/api/gat', {
            storeName,
            adminApiAccessToken
          })

          return response.data
        } catch (error) {
          throw error.response.data
        }
      }
    }
  })
})()
