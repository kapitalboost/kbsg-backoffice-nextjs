import { Col, Form, Input, Modal, Row } from 'antd'

interface IProps {
  isModalOpen: boolean
  handleCancel: any
}

const CreatePayout = ({ isModalOpen, handleCancel }: IProps) => {
  return (
    <Modal
      title="Basic Modal"
      open={isModalOpen}
      footer={false}
      onCancel={handleCancel}
    >
      <Form layout={'vertical'} size="large">
        <Row gutter={15}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item label="Date">
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default CreatePayout
