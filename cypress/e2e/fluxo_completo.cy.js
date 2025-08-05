describe('Fluxo Completo da Aplicação (E2E)', () => {
  // --- PREPARAÇÃO ---

  const userEmail = `cypress-${Date.now()}@teste.com`;
  const userPassword = 'PasswordValida123!';
  const nomeClienteInicial = 'Cliente do Teste E2E';
  const nomeClienteEditado = 'Cliente com Nome Editado';

  beforeEach(() => {
    cy.intercept('POST', '**/api/auth/register').as('registerRequest');
    cy.intercept('POST', '**/api/auth/login').as('loginRequest');
    cy.intercept('POST', '**/api/reservas').as('createReservaRequest');
    cy.intercept('GET', '**/api/reservas').as('getReservasRequest');
    cy.intercept('PUT', '**/api/reservas/*').as('updateReservaRequest');
    cy.intercept('POST', '**/api/reservas/*/confirmar').as('confirmReservaRequest');
  });

  it('Deve permitir o registro, login, criação, edição e confirmação de uma reserva', () => {
    // --- REGISTRO ---
    
    cy.visit('/register');
    cy.get('[data-cy="register-email"]').type(userEmail);
    cy.get('[data-cy="register-password"]').type(userPassword);
    cy.get('[data-cy="register-submit"]').click();

    cy.wait('@registerRequest');
    cy.contains('Conta criada com sucesso! Por favor, faça o login.').should('be.visible');

    // --- LOGIN ---

    cy.contains('a', 'Faça o login').click();
    cy.url().should('include', '/login');
    cy.get('[data-cy="login-email"]').type(userEmail);
    cy.get('[data-cy="login-password"]').type(userPassword);
    cy.get('[data-cy="login-submit"]').click();
    cy.wait('@loginRequest');
    cy.url().should('eq', 'http://localhost:3000/');
    cy.contains('h1', 'Minhas Reservas').should('be.visible');

    // --- CRIAÇÃO DA RESERVA ---

    cy.get('[data-cy="open-new-reserva-modal"]').click();
    cy.get('[data-cy="new-reserva-nome"]').type(nomeClienteInicial);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 15);
    const formattedDate = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}-${String(futureDate.getDate()).padStart(2, '0')}T${String(futureDate.getHours()).padStart(2, '0')}:${String(futureDate.getMinutes()).padStart(2, '0')}`;
    cy.get('[data-cy="new-reserva-data"]').type(formattedDate);
    cy.get('[data-cy="new-reserva-pessoas"]').type('2');
    cy.get('[data-cy="new-reserva-submit"]').click();
    cy.wait('@createReservaRequest');
    cy.contains('Reserva criada com sucesso!').should('be.visible');
    cy.wait('@getReservasRequest');
    cy.get('.card').contains(nomeClienteInicial).should('be.visible');

    // --- EDIÇÃO DA RESERVA ---

    cy.get('.card').contains(nomeClienteInicial).parents('.card').find('[data-cy*="edit-button-"]').click();
    cy.contains('h2', 'Editar Reserva').should('be.visible');
    cy.get('[data-cy="edit-reserva-nome"]').clear().type(nomeClienteEditado);
    cy.get('[data-cy="edit-reserva-pessoas"]').clear().type('3');
    cy.get('[data-cy="edit-reserva-submit"]').click();
    cy.wait('@updateReservaRequest');
    cy.contains('Reserva atualizada com sucesso!').should('be.visible');
    cy.wait('@getReservasRequest');

    cy.get('.card').contains(nomeClienteEditado).should('be.visible');
    cy.contains(nomeClienteInicial).should('not.exist');

    // --- CONFIRMAÇÃO DA RESERVA ---

    cy.get('.card').contains(nomeClienteEditado).parents('.card').find('[data-cy*="confirm-button-"]').click();
    cy.wait('@confirmReservaRequest');
    cy.contains('Reserva confirmada!').should('be.visible');
    cy.wait('@getReservasRequest');
    cy.get('.card').contains(nomeClienteEditado).parents('.card').contains('Status: Confirmada').should('be.visible');
  });
});