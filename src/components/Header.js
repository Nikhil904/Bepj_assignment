import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function BasicExample() {
  return (
    <Navbar expand="lg" className="square border-bottom">
      <Container>
        <Navbar.Brand className='text-uppercase' href="#home">logo</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link className='text-capitalize' href="#home">home</Nav.Link>
            <Nav.Link className='text-capitalize ms-5 lg:ms-5' href="#link">about</Nav.Link>
            <Nav.Link className='text-capitalize ms-5' href="#link">contact us</Nav.Link>
           
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;