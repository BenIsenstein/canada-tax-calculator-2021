import { FormSeparator, Page, PageContainer } from "../common"
import { SuperFormSelect } from "../components/SuperForm/GroupOfInputs"
import SuperForm from "../components/SuperForm/SuperForm"
import { useCalculateTotalTax, printDollarAmount } from "../functions"

const LandingPage = () => {
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

    const taxCalculatorInputs = [
        {
            name: "province",
            registerOptions: { required: "You must select a province." },
            isCustomComponent: true, 
            as: SuperFormSelect,
            asName: "SuperFormSelect",
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
            type: "number" 
        }
    ]


    return <Page>
      <PageContainer flexColumn>
        <SuperForm 
          noCancelButton
          titleText="Calculate Your Personal Income Tax"
          submitText="GO"
          inputs={taxCalculatorInputs}  
          onSubmit={calculateTotalTax} 
        />
        <br />
        <br />
        <br />
        <br />
        <FormSeparator />
        <h2>Income: {printDollarAmount(totalIncome)}</h2>
        <br />
        <h2>{location} province/territory tax: {printDollarAmount(provTax)}</h2>
        <h2>Federal tax: {printDollarAmount(fedTax)}</h2>
        <h2>CPP contribution: {printDollarAmount(cppAmount)}</h2>
        <h2>EI contribution: {printDollarAmount(eiAmount)}</h2>
        <br />
        <h2>{location} resident total tax: {printDollarAmount(Math.round(100*totalTax)/100)}</h2>
        <h2>{`Percent total tax on income of ${printDollarAmount(totalIncome)}: ${taxPercentage}%`}</h2>
        <h2>Income after tax: {printDollarAmount(incomeAfterTax)}</h2>
      </PageContainer>
    </Page>
}


export { LandingPage }