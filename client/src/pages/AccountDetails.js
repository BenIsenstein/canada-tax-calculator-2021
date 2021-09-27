import { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import UserContext from '../UserContext'
import { Page, PageContainer, Button, SwitchViewButton, FlexSection, FormSectionTitle, FormSeparator, PencilIcon, HomeAddIcon, ShareIcon } from '../common'
import { validatePassWithMessage, useUpdateAccount, useChangePassword, useHandleUserStatus } from '../functions'
import SuperForm from '../components/SuperForm/SuperForm'
import ToggleVisibleInput from '../components/SuperForm/ToggleVisibleInput'
import GroupOfInputs, { SuperFormSelect } from '../components/SuperForm/GroupOfInputs'
  
const AccountDetailsPage = ({setActivatedHomesLength}) => {
  useHandleUserStatus()
  const history = useHistory()
  const userContext = useContext(UserContext)
  const updateAccount = useUpdateAccount()
  const changePassword = useChangePassword()
  const [undergoingPasswordChange, setUndergoingPasswordChange] = useState(false)
  const [activatedHomes, setActivatedHomes] = useState([])
  const [deactivatedHomes, setDeactivatedHomes] = useState([])

  const ChangePasswordButton = () => !undergoingPasswordChange && <>
    <FlexSection fullWidth justifyStart marginTop1em>
      <Button
        text  
        type='button' 
        onClick={() => setUndergoingPasswordChange(true)}
      >
        Change Password
      </Button>      
    </FlexSection>
  </>

  const accountInputs = [
    {
      isCustomComponent: true,
      forwardErrors: true,
      as: GroupOfInputs,
      asName: "GroupOfInputs",
      inputs: [
        {
          name: "dateSignedUp",
          readOnly: true,
          labelText: "Member since"           
        },
        // {
        //   name: "userType",
        //   registerOptions: { required: "You must select an account type." },
        //   labelText: "You are a",
        //   isCustomComponent: true, 
        //   as: SuperFormSelect,
        //   options: [
        //     {value: "Home Manager"},
        //     {value: "Service Provider"},
        //     {value: "Insurance Provider"},
        //   ]
        // }
      ]
    },
    {
      isCustomComponent: true,
      forwardErrors: true,
      as: GroupOfInputs,
      asName: "GroupOfInputs",
      inputs: [
        {
          name: "firstName",
          registerOptions: { required: "You must input a first name." },
          labelText: "First Name",
          wrapperProps: {gridColumn: '1/2'}
        },
        {
          name: "lastName",
          registerOptions: { required: "You must input a last name." },
          labelText: "Last Name",
          wrapperProps: {gridColumn: '3/4'}
        }
      ]
    },
    {
      name: "email",
      registerOptions: { required: "You must input an email address." },
    }
  ]

  const passwordInputs = [
    {
      name: "password",
      registerOptions: { required: "You must input your old password." },
      labelText: "Old password",
      type: 'password'
    },
    {
      name: "newPassword",
      labelText: "New password",
      isCustomComponent: true,
      as: ToggleVisibleInput,
      asName: "ToggleVisibleInput",
      margin: "0 5px 0 0", 
      registerOptions: { 
        required: "You must input your new password.", 
        validate: (value) => validatePassWithMessage(value)
      }
    }
  ]

  // Effect to fetch all entries
  useEffect(() => {
    if (!userContext.user) return

    const fetchHomes = async () => {
      try {
        let activatedHomesRes = await fetch(`/api/home/getbyuser/activated/${userContext.user._id}`)
        let activatedHomesObject = await activatedHomesRes.json()

        let deactivatedHomesRes = await fetch(`/api/home/getbyuser/deactivated/${userContext.user._id}`)
        let deactivatedHomesObject = await deactivatedHomesRes.json()
      
        setActivatedHomes(activatedHomesObject)
        setActivatedHomesLength(activatedHomesObject.length)
        setDeactivatedHomes(deactivatedHomesObject)
      }  
      catch (err) {
        console.log(err)
        alert(`
          There was an error loading your homes. 
          We're fixing it as fast as we can.
        `)
      }
    }
    fetchHomes()

  }, [userContext.user, setActivatedHomesLength])

  return (
    <Page>
      <PageContainer flexColumn>
        <SuperForm 
          titleText="Profile"
          inputs={accountInputs} 
          formMode='details' 
          detailsUrl='/api/user/getloggedinuser' 
          onSubmit={updateAccount} 
          AfterTemplate={<ChangePasswordButton />}
        />
        <SuperForm 
          popup
          popupCondition={undergoingPasswordChange}
          titleText='Change Password'
          inputs={passwordInputs}
          onSubmit={changePassword}
          addModeCancel={() => setUndergoingPasswordChange(false)}
        />

        {/* <FormSeparator />

        <FlexSection alignCenter>
          <FormSectionTitle style={{margin: '0 0 .2em 0'}}>Manage Home(s)</FormSectionTitle>
          <Button inline onClick={() => history.push('/new-home')}><HomeAddIcon /></Button>
        </FlexSection>
        {activatedHomes.map((home, index) => {
          return (
            <FlexSection key={index}>
              <SwitchViewButton edit><PencilIcon onClick={() => history.push(`/home/${home._id}`)} /></SwitchViewButton>
              <ShareIcon />
              <p>{home.nickname} - {home.address}, {home.city} {home.province}, {home.postalCode}</p>
            </FlexSection>
          )
        })}

        {deactivatedHomes.length > 0 && <>
          <FlexSection alignCenter>
            <FormSectionTitle style={{margin: '1em 0 .2em 0'}}>Deactivated Home(s)</FormSectionTitle>
          </FlexSection>
          {deactivatedHomes.map((home, index) => {
            return (
              <FlexSection key={index}>
                <SwitchViewButton edit><PencilIcon onClick={() => history.push(`/home/${home._id}`)} /></SwitchViewButton>
                <ShareIcon />
                <p>{home.nickname} - {home.address}, {home.city} {home.province}, {home.postalCode}</p>
              </FlexSection>
            )
          })}
        </>} */}
      </PageContainer>
    </Page>
  )
}

export { AccountDetailsPage }