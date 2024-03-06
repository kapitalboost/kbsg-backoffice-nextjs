import { Col, Divider, Row } from 'antd'
import { Typography } from 'antd'

interface IProps {
  user: any
}

const UserInformation = ({ user }: IProps) => {
  return (
    <div>
      {user ? (
        <>
          <Row gutter={20}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h4 className="m-0 p-0">First Name :</h4>
              <Typography className="pb-1 fs-2">{user?.firstname}</Typography>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h4 className="m-0 p-0">Last Name :</h4>
              <Typography className="pb-1 fs-2">{user?.lastname}</Typography>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h4 className="m-0 p-0">Email :</h4>
              <Typography className="pb-1 fs-2">{user?.email}</Typography>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h4 className="m-0 p-0">Date of Birth :</h4>
              <Typography className="pb-1 fs-2">{user?.dbo || '-'}</Typography>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h4 className="m-0 p-0">Phone No :</h4>
              <Typography className="pb-1 fs-2">
                {user?.phone_no || '-'}
              </Typography>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h4 className="m-0 p-0">Country :</h4>
              <Typography className="pb-1 fs-2">{user?.country}</Typography>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h4 className="m-0 p-0">Nationality :</h4>
              <Typography className="pb-1 fs-2">
                {user?.nationality || '-'}
              </Typography>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h4 className="m-0 p-0">Residential Address :</h4>
              <Typography className="pb-1 fs-2">
                {user?.address || '-'}
              </Typography>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h4 className="m-0 p-0">How You Know Us :</h4>
              <Typography className="pb-1 fs-2">
                {user?.how_you_know}
              </Typography>
            </Col>
          </Row>

          <Divider orientation="left" dashed>
            Card Identity
          </Divider>

          <Row gutter={20}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h4 className="m-0 p-0">NRIC / Passport Number :</h4>
              <Typography className="pb-1 fs-2">{user?.nric || '-'}</Typography>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h4 className="m-0 p-0">IC Country :</h4>
              <Typography className="pb-1 fs-2">
                {user?.ic_country || '-'}
              </Typography>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h4 className="m-0 p-0">Full Name in IC :</h4>
              <Typography className="pb-1 fs-2">
                {user?.ic_name || '-'}
              </Typography>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h4 className="m-0 p-0">Status Verified :</h4>
              <Typography className="pb-1 fs-2">
                {user?.is_verified ? 'VERIFIED' : 'NOT VERIFIED'}
              </Typography>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <h4 className="m-0 p-0">ID Card / Passport (front) :</h4>
              {user?.nric_file ? (
                <a href={user?.nric_file} target={`_blank`}>
                  <img src={user?.nric_file} width={`100%`} alt={`user nric`} />
                </a>
              ) : (
                <>
                  <img
                    src="https://dummyimage.com/600x400/d9d9d9/000000.jpg&text=Image+Not+Found"
                    width={`100%`}
                    alt={`Image not found`}
                  />
                </>
              )}
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <h4 className="m-0 p-0">ID Card / Passport (back) :</h4>
              {user?.nric_file_back ? (
                <a href={user?.nric_file_back} target={`_blank`}>
                  <img
                    src={user?.nric_file_back}
                    width={`100%`}
                    alt={`user nric back`}
                  />
                </a>
              ) : (
                <>
                  <img
                    src="https://dummyimage.com/600x400/d9d9d9/000000.jpg&text=Image+Not+Found"
                    width={`100%`}
                    alt={`Image not found`}
                  />
                </>
              )}
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <h4 className="m-0 p-0">Proof of Address :</h4>
              {user?.address_proof ? (
                <a href={user?.address_proof} target={`_blank`}>
                  <img
                    src={user?.address_proof}
                    width={`100%`}
                    alt={`user address proof`}
                  />
                </a>
              ) : (
                <>
                  <img
                    src="https://dummyimage.com/600x400/d9d9d9/000000.jpg&text=Image+Not+Found"
                    width={`100%`}
                    alt={`Image not found`}
                  />
                </>
              )}
            </Col>
          </Row>
        </>
      ) : (
        <>User not found</>
      )}
    </div>
  )
}

export default UserInformation
