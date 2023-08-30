import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

  let token
  before(() => {
    cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
  });

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)

    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'

    }).then((response) => {
      expect(response.body.usuarios[0].nome).to.equal('Fulano da Silva')
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
      expect(response.duration).to.be.lessThan(24)
    });

    it('Deve cadastrar um usuário com sucesso', () => {
      let usuario = `Usuario EBAC ${Math.floor(Math.random() * 100000000)}`
      cy.request({
        method: 'POST',
        url: 'usuarios',
        body: {
          "nome": usuario,
          "email": 'elisama@gmail.com',
          "password": '@Elisama@',
          "administrador": "true"
        },
        headers: { authorization: token }
      }).then((response) => {
        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      })
    });

    it('Deve validar um usuário com email inválido', () => {
      cy.request({
        method: 'POST',
        url: 'usuarios',
        body: {
          "nome": usuario,
          "email": 'elisama@gmail.com',
          "password": '@Elisama@',
          "administrador": "true"
        },
        headers: { authorization: token }
      }).then((response) => {
        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal('Email deve ser um email válido')
      })
    });

    it('Deve editar um usuário cadastrado', () => {
      cy.request('usuarios').then(response => {
        let id = response.body.usuarios[0]._id
        cy.request({
          method: 'PUT',
          url: `usuarios/${id}`,
          headers: { authorization: token },
          body:
          {
            "nome": "Elisama Silva",
            "email": "elisama@gmail.com",
            "password": "@Elisama@",
            "administrador": "true"
          }
        }).then(response => {
          expect(response.body.message).to.equal('Registro alterado com sucesso')
        })
      });

      it('Deve deletar um usuário cadastrado', () => {
        let usuario = `Usuario EBAC ${Math.floor(Math.random() * 100000000)}`
        cy.cadastrarUsuario(token, usuario, email, password)
          .then(response => {
            let id = response.body._id
            cy.request({
              method: 'DELETE',
              url: `usuarios/${id}`,
              headers: { authorization: token }
            }).then(response => {
              expect(response.body.message).to.equal('Registro excluído com sucesso')
              expect(response.status).to.equal(200)
            })
          })
      })
    })

  })

});