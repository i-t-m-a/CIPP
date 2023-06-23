import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCol,
  CForm,
  CFormLabel,
  CRow,
  CSpinner,
  CCallout,
} from '@coreui/react'
import { Form } from 'react-final-form'
import {
  Condition,
  RFFCFormCheck,
  RFFCFormInput,
  RFFCFormSelect,
  RFFCFormSwitch,
  RFFCFormTextarea,
  RFFSelectSearch,
} from 'src/components/forms'
import { CippPage } from 'src/components/layout'
import countryList from 'src/data/countryList'
import { useLazyGenericPostRequestQuery } from 'src/store/api/app'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { required } from 'src/validators'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'

const NewSecureNote = () => {
  let navigate = useNavigate()

  const [genericPostRequest, postResults] = useLazyGenericPostRequestQuery()
  const onSubmit = (values) => {
    const shippedValues = {
      Title: values.title ,
      Hint: values.hint,
      Password: values.password,
      Content: values.contente,
      Recipient: values.recipient ,
    }
    //window.alert(JSON.stringify(shippedValues))
    genericPostRequest({ path: '/api/NewSecureNote', values: shippedValues })
  }
  const usagelocation = useSelector((state) => state.app.usageLocation)
  const initialState = {
    Autopassword: false,
    usageLocation: usagelocation,
    ...allQueryObj,
  }
  const copyUserVariables = (t) => {
    for (const [key, value] of Object.entries(t.value)) {
      query.delete(key)
      if (value != null) {
        query.append(key, value)
      }
      navigate(`?${query.toString()}`)
    }
  }
  return (
    <CippPage title="Create Secure Note">
      {postResults.isSuccess && (
        <CCallout color="success" dismissible>
          {postResults.data?.Results.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </CCallout>
      )}
      <CRow>
        <CCol md={6}>
          <CCard>
            <CCardHeader>
              <CCardTitle>Secure Note Details</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <Form
                initialValues={{ ...initialState }}
                onSubmit={onSubmit}
                render={({ handleSubmit, submitting, values }) => {
                  return (
                    <CForm onSubmit={handleSubmit}>
                      <CRow>
                        <CCol md={6}>
                          <RFFCFormInput type="text" name="title" label="Note Title" />
                        </CCol>
                        <CCol md={6}>
                          <RFFCFormInput type="text" name="hint" label="Hint (optional)" />
                        </CCol>
                      </CRow>
                      <CRow>
                      <CCol md={6}>
                          <RFFCFormInput type="text" name="password" label="One-Time Code" />
                        </CCol>
                        <CCol md={6}>
                          <RFFCFormInput type="text" name="recipient" label="Recipient (optional)" />
                        </CCol>
                      </CRow>   
                      <CRow>
                        <CCol md={12}>
                          <RFFCFormTextarea
                            type="text"
                            name="content"
                            label="Note Content"
                            placeholder=""
                          />
                        </CCol>
                      </CRow>

                      <CRow className="mb-3">
                        <CCol md={6}>
                          <CButton type="submit" disabled={submitting}>
                            Add User
                            {postResults.isFetching && (
                              <FontAwesomeIcon
                                icon={faCircleNotch}
                                spin
                                className="me-2"
                                size="1x"
                              />
                            )}
                          </CButton>
                        </CCol>
                      </CRow>
                      {postResults.isSuccess && (
                        <CCallout color="success">
                          {postResults.data.Results.map((message, idx) => {
                            return <li key={idx}>{message}</li>
                          })}
                        </CCallout>
                      )}
                    </CForm>
                  )
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CippPage>
  )
}

export default NewSecureNote
