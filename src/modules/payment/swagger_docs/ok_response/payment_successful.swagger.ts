export const paymentSuccessSwagger = {
  description: 'Renders a success payment HTML page.',
  schema: {
    type: 'string',
    example: `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Payment Success</title>
          </head>
          <body>
            <h1>Payment Successful</h1>
            <p>Order ID: 12345</p>
            <p>Status: Approved</p>
            <p>Amount: 100 USD</p>
          </body>
        </html>
      `,
  },
};
