import { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import ultralightCopy from 'copy-to-clipboard-ultralight'
import download from 'in-browser-download'
import pdf from 'pdfjs'
import helvetica from 'pdfjs/font/Helvetica'
import { FormSeparator, Page, PageContainer, FlexSection, Button } from "../common"
import { SuperFormSelect } from "../components/SuperForm/GroupOfInputs"
import { SuperForm, ComplexInput } from "@benisenstein/react-hook-superform"
import { useCalculateTotalTax, printDollarAmount } from "../functions"
import useConfirmModal from "../components/Modals/useConfirmModal"
import ConfirmModal from "../components/Modals/ConfirmModal"

const LandingPage = () => {
    const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false)
    const [userEmail, setUserEmail] = useState('')
    const [selectedFileType, setSelectedFileType] = useState('txt')
    const { isConfirmModalShowing: isEmailModalShowing, toggleConfirmModal: toggleEmailModal } = useConfirmModal()
    const { isConfirmModalShowing: isDownloadModalShowing, toggleConfirmModal: toggleDownloadModal } = useConfirmModal()

    const {
      calculateTotalTax,
      totalIncome,
      location,
      provTax,
      fedTax,
      cppAmount,
      eiAmount,
      totalTax,
      taxPercentage,
      incomeAfterTax } = useCalculateTotalTax()


    // Form inputs

    const taxCalculatorInputs = [
      {
        name: "province",
        registerOptions: { required: "You must select a province." },
        isCustomComponent: true, 
        as: SuperFormSelect,
        options: [
          {value: "AB"},
          {value: "BC"},
          {value: "SK"},
          {value: "MB"},
          {value: "ON"},
          {value: "PE"},
          {value: "NL"},
          {value: "NB"},
          {value: "NS"},
          {value: "YT"},
          {value: "NT"},
          {value: "NU"}
        ]
      },
      {
        name: "income",
        registerOptions: { required: "You must select an income amount." },
        type: "number" 
      }
    ]



    // Landing title component

    const LandingTitle = styled.h1`
      width: 80%;
      align-self: center;
      text-align: center;
      font-size: 2em;
      font-weight: bolder;
      text-transform: uppercase;
      line-height: .8em;
      color: white;
      
      @media (min-width: ${props => props.theme.smScreen}) {
        font-size: 3em;
      }
    `
    // Custom CSS

    let pageContainerCss = () => `
      background-color: transparent;
    `

    let formWrapperCss = () => `
      align-self: center; 
      width: 40%;
    `

    let taxInfoCss = (props) => `
      position: relative;

      @media (max-width: 1000px) {
        flex-direction: column-reverse;
        align-items: flex-start;
      }
    `

    let taxTextCss = () => `
      min-width: max-content;
      
    `

    let taxButtonsCss = (props) => `
      position: absolute;
      left: 0;

      @media (max-width: 1000px) {
        position: relative;
      }
    `

    // Tax info messages

    const taxInfoHtmlMessage = useMemo(() => `
      <h2>Income: ${printDollarAmount(totalIncome)}</h2>
      <br />
      <h2>Federal tax: ${printDollarAmount(fedTax)}</h2>
      <h2>${location} province/territory tax: ${printDollarAmount(provTax)}</h2>
      <br />
      <h2>EI contribution: ${printDollarAmount(Math.round(100*eiAmount)/100)}</h2>
      <h2>CPP contribution: ${printDollarAmount(Math.round(100*cppAmount)/100)}</h2>
      <br />
      <h2>${location} resident total tax: ${printDollarAmount(Math.round(100*totalTax)/100)}</h2>
      <h2>${`Percent total tax on income of ${printDollarAmount(totalIncome)}: ${taxPercentage}%`}</h2>
      <h2>Income after tax: ${printDollarAmount(incomeAfterTax)}</h2>
    `, [
      totalIncome, 
      fedTax, 
      location, 
      cppAmount, 
      eiAmount, 
      taxPercentage, 
      provTax, 
      totalTax, 
      incomeAfterTax
    ])

    const taxInfoPlainMessage = useMemo(() => `
      Income: ${printDollarAmount(totalIncome)} \n
      \n
      Federal tax: ${printDollarAmount(fedTax)} \n
      ${location} province/territory tax: ${printDollarAmount(provTax)} \n
      \n
      EI contribution: ${printDollarAmount(Math.round(100*eiAmount)/100)} \n
      CPP contribution: ${printDollarAmount(Math.round(100*cppAmount)/100)} \n
      \n
      ${location} resident total tax: ${printDollarAmount(Math.round(100*totalTax)/100)} \n
      ${`Percent total tax on income of ${printDollarAmount(totalIncome)}: ${taxPercentage}%`} \n
      Income after tax: ${printDollarAmount(incomeAfterTax)} \n
    `, [
      totalIncome, 
      fedTax, 
      location, 
      cppAmount, 
      eiAmount, 
      taxPercentage, 
      provTax, 
      totalTax, 
      incomeAfterTax
    ])

    // Email tax info function

    const emailTaxInfo = useCallback(async () => {
      let options = {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          recipient: userEmail,
          message: taxInfoHtmlMessage
        })
      }

      try { 
        let sendEmailRes = await fetch('/api/sendEmail', options)
        let sendEmailObject = await sendEmailRes.json()

        if (!sendEmailObject.success) return alert('There was a problem emailing you your tax info! Please try again another time.')

        alert(`Your tax info has been sent to ${userEmail}.`)
      }
      catch (error) {
        alert('There was a problem emailing you your tax info! Please try again another time.')
        console.log('Error with emailTaxInfo: ', error)
      }

    }, [userEmail, taxInfoHtmlMessage])


    // download info as .pdf file
    const downloadTaxInfoPdfFile = useCallback(async () => {
      const doc = new pdf.Document({ font: helvetica })

      doc.header().text("Your 2021 Tax Info", { fontSize: 18, underline: true }).br()
      doc.text(taxInfoPlainMessage)

      const docBuffer = await doc.asBuffer() // resolves to a Uint8 Array

      download(docBuffer.buffer, 'my-tax-info.pdf')

    }, [taxInfoPlainMessage])

    // download info as .txt file
    const downloadTaxInfoTextFile = useCallback(() => {
      download(taxInfoPlainMessage, 'my-tax-info.txt')

    }, [taxInfoPlainMessage])

    const downloadOptions = useMemo(() => ({
      'txt': downloadTaxInfoTextFile, 
      'pdf': downloadTaxInfoPdfFile

    }), [downloadTaxInfoTextFile, downloadTaxInfoPdfFile])

    // Render the page

    return <Page>
      <PageContainer flexColumn extraCss={pageContainerCss}>
        <LandingTitle>
            Canada Tax Calculator 2021
        </LandingTitle>  

        <br/ >
        <br />
        <br />
        <br />

        <FlexSection extraCss={formWrapperCss}>
          <SuperForm 
            noCancelButton
            titleText='Calculate Your Personal Income Tax'
            submitText='GO'
            inputs={taxCalculatorInputs}  
            onSubmit={data => {setHasBeenSubmitted(true); calculateTotalTax(data)}} 
          />
        </FlexSection>
        
        <br />
        <br />
        <br />
        <br />

        <FormSeparator />

        {hasBeenSubmitted && 
        <FlexSection slideInLeft justifyCenter fullWidth extraCss={taxInfoCss}>
            <FlexSection column alignStart fullHeight spaceBetween extraCss={taxButtonsCss}>
              <Button important  onClick={() => setHasBeenSubmitted(false)}>
                  CLEAR
              </Button>
              <FlexSection column alignStart>
                <Button important onClick={() => {if (ultralightCopy(taxInfoPlainMessage)) {alert('Copied info')} else {alert('There was a problem copying your info.')}}}>
                    Copy Tax Info
                </Button>
                {/* <Button important onClick={toggleEmailModal}>
                    Email Me Tax Info
                </Button> */}
                
                <ConfirmModal
                  isConfirmModalShowing={isEmailModalShowing}
                  hideConfirmModal={toggleEmailModal}
                  modalContent={<ComplexInput 
                    isAddMode 
                    name="Email - I Won't Keep It!" 
                    value={userEmail} 
                    onChange={event => setUserEmail(event.target.value)} 
                  />}
                  confirmPrompt='Send'
                  actionOnConfirm={async () => {await emailTaxInfo(); setUserEmail('')}}
                  actionOnCancel={() => setUserEmail('')}
                />

                <Button important onClick={toggleDownloadModal}>
                    Download Tax Info
                </Button>

                <ConfirmModal
                  isConfirmModalShowing={isDownloadModalShowing}
                  hideConfirmModal={toggleDownloadModal}
                  modalContent={<ComplexInput
                    isAddMode 
                    name="File Type" 
                    autoFocus
                    as={SuperFormSelect}
                    options={[
                      { value: 'txt', optionText: 'Text File (.txt)' }, 
                      { value: 'pdf', optionText: 'PDF (.pdf)' }
                    ]}
                    value={selectedFileType} 
                    onChange={event => setSelectedFileType(event.target.value)} 
                  />}
                  confirmPrompt='Download'
                  actionOnConfirm={downloadOptions[selectedFileType]}
                  actionOnCancel={() => {}}
                />


              </FlexSection>
              
            </FlexSection>
            <FlexSection column alignStart extraCss={taxTextCss}>
              <h2>Income: {printDollarAmount(totalIncome)}</h2>
              <br />
              <h2>Federal tax: {printDollarAmount(fedTax)}</h2>
              <h2>{location} province/territory tax: {printDollarAmount(provTax)}</h2>
              <br />
              <h2>EI contribution: {printDollarAmount(Math.round(100*eiAmount)/100)}</h2>
              <h2>CPP contribution: {printDollarAmount(Math.round(100*cppAmount)/100)}</h2>
              <br />
              <h2>{location} resident total tax: {printDollarAmount(Math.round(100*totalTax)/100)}</h2>
              <h2>{`Percent total tax on income of ${printDollarAmount(totalIncome)}: ${taxPercentage}%`}</h2>
              <h2>Income after tax: {printDollarAmount(incomeAfterTax)}</h2>
            </FlexSection>
        </FlexSection>}
      </PageContainer>
    </Page>
}


export { LandingPage }