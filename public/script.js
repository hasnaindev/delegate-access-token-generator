(() => {
  const form = document.getElementById('form')
  const storeNameInput = document.getElementById('store-name')
  const adminApiAccessTokenInput = document.getElementById('admin-api-access-token')

  const dialogBoxContainer = document.getElementById('dialog-container')

  let isProcessing = false

  form.addEventListener('submit', event => {
    event.preventDefault()

    if (isProcessing) return
    isProcessing = true

    const storeName = storeNameInput.value
    const adminApiAccessToken = adminApiAccessTokenInput.value

    fetchDelegateAccessToken({ storeName, adminApiAccessToken })
      .then(({ errors, delegateAccessToken }) => {
        if (errors) {
          alert('Something went wrong, please check console more for information')
          return console.error(errors)
        }

        openDialogBox(delegateAccessToken)
      })
      .catch((error) => {
        alert('Something went wrong, please check console more for information')
        console.error(error)
      })
      .finally(() => {
        isProcessing = false
      })
  })

  async function fetchDelegateAccessToken ({ storeName, adminApiAccessToken }) {
    if (!storeName || !adminApiAccessToken) return

    const response = await fetch('/api/gat', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ storeName, adminApiAccessToken })
    })

    return response.json()
  }

  dialogBoxContainer.querySelector('button').addEventListener('click', () => {
    navigator.clipboard.writeText(dialogBoxContainer.querySelector('#content').value)

    closeDialogBox()
  })

  const openDialogBox = content => {
    dialogBoxContainer.style.display = 'block'
    dialogBoxContainer.querySelector('#content').value = content
  }

  const closeDialogBox = () => {
    dialogBoxContainer.style.display = 'none'
    dialogBoxContainer.querySelector('#content').value = ''
  }
})()