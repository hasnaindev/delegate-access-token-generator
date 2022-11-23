const getDelegateAccessTokenQuery = `
  mutation delegateAccessTokenCreate($input: DelegateAccessTokenInput!) {
    delegateAccessTokenCreate(input: $input){
      delegateAccessToken {
        accessToken
      }
      shop {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`

module.exports = {
  getDelegateAccessTokenQuery
}
