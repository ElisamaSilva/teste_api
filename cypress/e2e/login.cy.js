describe('Login', () => {
  it('Deve Fazer Login', () => {
      cy.request({
          method: 'POST',
          url: 'login',
          body: {
              "email": "fulano@qa.com",
              "password": "teste"
          }
      }).then((response) => {
          expect(response.status).to.equal(200)
          expect(response.body.message).to.equal('Login realizado com sucesso')
    
      })

  })

});