import React from 'react'
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

function Createuser({ show, handleClose }) {
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        contentClassName="custom-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-semibold fs-4">Create</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form className="custom-form fw-semibold">
            {/* Row 1: First and Last Name */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="firstName">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="First name"
                    className="custom-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="lastName">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Last name"
                    className="custom-input"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 2: Username and Phone */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    className="custom-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="phone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Phone"
                    className="custom-input"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 3: Email and Password */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    className="custom-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    className="custom-input"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 4: Role */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="role">
                  <Form.Label>Role</Form.Label>
                  <Form.Select className="custom-input">
                    <option>Please Select</option>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Staff</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer className="border-0">
          <Button type="submit" className="submit-btn w-100">
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}

export default Createuser;
