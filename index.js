const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const { getDelegateAccessTokenQuery } = require('./queries')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.engine('handlebars', engine())
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => res.render('index'))
app.get('*', (req, res) => res.status(302).redirect('/'))

app.post('/api/gat', async (req, res) => {
  const { storeName, adminApiAccessToken } = req.body

  try {
    const response = await fetch(`https://${storeName}.myshopify.com/admin/api/2022-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminApiAccessToken
      },
      body: JSON.stringify({
        query: getDelegateAccessTokenQuery,
        variables: {
          input: {
            expiresIn: 86400 * 365 * 2, // 2 years
            delegateAccessScope: [
              'read_products',
              'unauthenticated_read_product_listings',
              'unauthenticated_read_product_inventory',
              'unauthenticated_read_product_pickup_locations',
              'unauthenticated_read_product_tags',
              'unauthenticated_write_checkouts',
              'unauthenticated_read_checkouts',
              'unauthenticated_read_content',
              'unauthenticated_read_content_entries',
              'unauthenticated_read_content_models',
              'unauthenticated_write_customers',
              'unauthenticated_read_customers',
              'unauthenticated_read_customer_tags',
              'unauthenticated_read_selling_plans'
            ]
          }
        }
      })
    })

    const { data } = await response.json()

    const userErrors = data.delegateAccessTokenCreate.userErrors

    if (Array.isArray(userErrors) && !!userErrors.length) {
      return res.status(400).json({
        errors: userErrors
      })
    }

    res.status(200).json({
      delegateAccessToken: data.delegateAccessTokenCreate.delegateAccessToken.accessToken
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error, please ensure that the store name and access token are valid' })
  }
})

app.listen(process.env.PORT || 8080, () => {
  console.log('server is up and running 🚀')
})
