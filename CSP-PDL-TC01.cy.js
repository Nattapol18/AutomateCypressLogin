import 'cypress-mochawesome-reporter/register';

const url = 'http://192.168.115.15:99/'
const Username = '#username'
const Password = '#password'

describe('TC01 Login', function () {
  beforeEach(function() {
    cy.visit(url)
    cy.viewport(1280, 720)
  })

  it('TC01-001	ผู้ใช้งานไม่กรอกข้อมูล Username และ Password ระบบแสดงการแจ้งเตือน', function() {
    cy.get('button').contains('LOGIN').click()
    cy.contains('Please input Username')
    cy.get('button').contains('OK').click()
  })

  it('TC01-002 ผู้ใช้งานกรอกข้อมูล Username ไม่ถูกต้อง กรอก Password ถูกต้อง ระบบแสดงการแจ้งเตือน', function() {
    cy.get(Username).type('xxx')
    cy.get(Password).type('P@ssw0rd')
    cy.get('button').contains('LOGIN').click()
    cy.contains('The username or password was not found in the system.')
    cy.get('button').contains('OK').click()
  })

  it('TC01-003 ผู้ใช้งานกรอกข้อมูล Username ถูกต้อง และ กรอก Password ไม่ถูกต้อง ระบบแสดงการแจ้งเตือน', function() {
    cy.get(Username).type('101610048').should('have.value','101610048')
    cy.get(Password).type('xxx').should('have.value', 'xxx')
    cy.get('button').contains('LOGIN').click()
    cy.contains('The username or password was not found in the system.')
    cy.get('button').contains('OK').click()
  })

   it('TC01-004 ผู้ใช้งานกรอก Username และ Password ที่ยังไม่ผ่านการ Approved ระบบแสดงการแจ้งเตือน', function() {
    cy.get(Username).type('Test').should('have.value','Test')
    cy.get(Password).type('P@ssw0rd').should('have.value', 'P@ssw0rd')
    cy.get('button').contains('LOGIN').click()
    cy.contains('This username and password are not allowed to access this system.')
    cy.get('button').contains('OK').click()
  })

   it('TC01-005 ผู้ใช้งานกรอก Username และ Password ที่ผ่านการ Approved แต่ไม่ได้เลือก User Group ระบบแสดงการแจ้งเตือน', function() {
    cy.get(Username).type('UserTest02').should('have.value','UserTest02')
    cy.get(Password).type('P@ssw0rd').should('have.value', 'P@ssw0rd')
    cy.get('button').contains('LOGIN').click()
    cy.contains('This username and password are not allowed to access this system.')
    cy.get('button').contains('OK').click()
  })

  it('TC01-006 ผู้ใช้งานกรอก Username และ Password ที่ไม่มีสิทธิ์ตั้งค่า ระบบแสดงเมนูตามตั้งค่าสิทธิ์', function() {
    cy.get(Username).type('Infra').should('have.value','Infra')
    cy.get(Password).type('Infra@0002').should('have.value', 'Infra@0002')
    cy.get('button').contains('LOGIN').click()
    cy.url().should('include', 'Main?lang=EN')
    cy.wait(2000)
    cy.contains('Received ', { timeout: 10000 }).should('not.exist')
    cy.contains(/MASTER MANAGEMENT/i).should('not.exist')
  })

  it('TC01-007 ผู้ใช้งานกรอก Username และ Password ที่มีสิทธิ์ตั้งค่า สามารถเข้าใช้งานเมนู Setting ได้', function() {
    cy.get(Username).type('101610048').should('have.value','101610048')
    cy.get(Password).type('P@ssw0rd').should('have.value','P@ssw0rd')
    cy.get('button').contains('LOGIN').click()
    cy.url().should('include', 'Main?lang=EN')
    cy.wait(2000)
    cy.contains('Defect', { timeout: 10000 }).should('be.visible')
    cy.contains('Received ', { timeout: 10000 }).should('be.visible')
    cy.contains(/MASTER MANAGEMENT/i, { timeout: 10000 }).should('be.visible')
    cy.contains('Product Type', { timeout: 10000 }).should('be.visible')
    cy.contains('Reason Defect', { timeout: 10000 }).should('be.visible')
    cy.contains('Product Barcode', { timeout: 10000 }).should('be.visible')
  })
})