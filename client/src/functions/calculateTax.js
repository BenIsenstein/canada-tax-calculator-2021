import { useState } from 'react'

let printDollarAmount = amount => {
    let [dollars, cents] = amount.toString().split('.')
    
    if (!cents) cents = '0'
    
    dollars = dollars
        .split('')
        .reverse()
        .map((digit, index) => index%3===0 && index!==0 ? `${digit}, ` : digit)
        .reverse()
        .join('')
    
    
    return `$${dollars}.${cents}`
}

let calculateTax = (income, taxBrackets) => {
    let totalTax = 0
    
    taxBrackets.forEach(({ bracket: currentBracket, tax: currentTax }, index) => {
        let previousBracket = taxBrackets[index-1]?.bracket
        let differenceWithinBracket = (
            (income > currentBracket) ? 0 : 
            (currentBracket-income > currentBracket-previousBracket) ? currentBracket-previousBracket : 
            currentBracket-income
        )
        
        if (index === 0) return
        if (index === taxBrackets.length - 1) {totalTax += (income > previousBracket) ? ((income - previousBracket) * currentTax) : 0; return}
        
        totalTax += ((currentBracket - previousBracket) - differenceWithinBracket) * currentTax
    })
    
    return Math.round(100*totalTax)/100
}


let fedTaxBrackets = [
    {bracket: 0, tax: 0}, 
    {bracket: 49020, tax: 0.15}, 
    {bracket: 98040, tax: 0.205}, 
    {bracket: 151978, tax: 0.26}, 
    {bracket: 216511, tax: 0.29},
    {bracket: Infinity, tax: 0.33}
]


let calculateFederalTax = income => calculateTax(income, fedTaxBrackets) 


let albertaTaxBrackets = [
    {bracket: 0, tax: 0}, 
    {bracket: 131220, tax: 0.10}, 
    {bracket: 157464, tax: 0.12}, 
    {bracket: 209952, tax: 0.13}, 
    {bracket: 314928, tax: 0.14},
    {bracket: Infinity, tax: 0.15}
]

//let calculateAlbertaTax
let calculateAlbertaTax = income => calculateTax(income, albertaTaxBrackets)

//let bcTaxBrackets
let bcTaxBrackets = [
    {bracket: 0, tax: 0}, 
    {bracket: 41725, tax: 0.0506}, 
    {bracket: 83451, tax: 0.077}, 
    {bracket: 95812, tax: 0.105}, 
    {bracket: 116344, tax: 0.1229},
    {bracket: 157748, tax: 0.147},
    {bracket: 220000, tax: 0.168},
    {bracket: Infinity, tax: 0.205}
]

//let calculateBcTax
let calculateBcTax = income => calculateTax(income, bcTaxBrackets)

//let manitobaTaxBrackets
let manitobaTaxBrackets = [
    {bracket: 0, tax: 0}, 
    {bracket: 33389, tax: 0.108}, 
    {bracket: 72164, tax: 0.1275},  
    {bracket: Infinity, tax: 0.174}
]

//let calculateManitobaTax
let calculateManitobaTax = income => calculateTax(income, manitobaTaxBrackets)

//let nbTaxBrackets
let nbTaxBrackets = [
    {bracket: 0, tax: 0}, 
    {bracket: 43401, tax: 0.0968}, 
    {bracket: 86803, tax: 0.1482}, 
    {bracket: 141122, tax: 0.1652}, 
    {bracket: 160776, tax: 0.1784},
    {bracket: Infinity, tax: 0.203}
]

//let calculateNbTax
let calculateNbTax = income => calculateTax(income, nbTaxBrackets)

//let nlTaxBrackets
let nlTaxBrackets = [
    {bracket: 0, tax: 0}, 
    {bracket: 37929, tax: 0.087}, 
    {bracket: 75858, tax: 0.145}, 
    {bracket: 135432, tax: 0.158}, 
    {bracket: 189604, tax: 0.173},
    {bracket: Infinity, tax: 0.183}
]

//let calculateNlTax
let calculateNlTax = income => calculateTax(income, nlTaxBrackets)

//let nwtTaxBrackets
let nwtTaxBrackets = [
    {bracket: 0, tax: 0}, 
    {bracket: 43957, tax: 0.059}, 
    {bracket: 87916, tax: 0.086}, 
    {bracket: 142932, tax: 0.122}, 
    {bracket: Infinity, tax: 0.1405}
]

//let calculateNwtTax
let calculateNwtTax = income => calculateTax(income, nwtTaxBrackets)

//let nsTaxBrackets
let nsTaxBrackets = [
    {bracket: 0, tax: 0}, 
    {bracket: 29590, tax: 0.0879}, 
    {bracket: 59180, tax: 0.1495}, 
    {bracket: 93000, tax: 0.1667}, 
    {bracket: 150000, tax: 0.175},
    {bracket: Infinity, tax: 0.21}
]

//let calculateNsTax
let calculateNsTax = income => calculateTax(income, nsTaxBrackets)

//let nunavutTaxBrackets
let nunavutTaxBrackets = [
    {bracket: 0, tax: 0}, 
    {bracket: 46277, tax: 0.04}, 
    {bracket: 92555, tax: 0.07}, 
    {bracket: 150473, tax: 0.09}, 
    {bracket: Infinity, tax: 0.115}
]

//let calculateNunavutTax
let calculateNunavutTax = income => calculateTax(income, nunavutTaxBrackets)

//let ontarioTaxBrackets
let ontarioTaxBrackets = [
    {bracket: 0, tax: 0}, 
    {bracket: 44740, tax: 0.0505}, 
    {bracket: 89482, tax: 0.0915}, 
    {bracket: 150000, tax: 0.1116}, 
    {bracket: 220000, tax: 0.1216},
    {bracket: Infinity, tax: 0.1316}
]

//let calculateOntarioTax
let calculateOntarioTax = income => calculateTax(income, ontarioTaxBrackets)

//let peiTaxBrackets
let peiTaxBrackets = [
    {bracket: 0, tax: 0}, 
    {bracket: 31984, tax: 0.098}, 
    {bracket: 63969, tax: 0.138}, 
    {bracket: Infinity, tax: 0.167}
]

//let calculatePeiTax
let calculatePeiTax = income => calculateTax(income, peiTaxBrackets)

//let saskatchewanTaxBrackets
let saskatchewanTaxBrackets = [
    {bracket: 0, tax: 0}, 
    {bracket: 45225, tax: 0.105}, 
    {bracket: 129214, tax: 0.125}, 
    {bracket: Infinity, tax: 0.145}
]

//let calculateSaskatchewanTax
let calculateSaskatchewanTax = income => calculateTax(income, saskatchewanTaxBrackets)

//let yukonTaxBrackets
let yukonTaxBrackets = [
    {bracket: 0, tax: 0}, 
    {bracket: 48535, tax: 0.064}, 
    {bracket: 97069, tax: 0.09}, 
    {bracket: 150473, tax: 0.109}, 
    {bracket: 500000, tax: 0.128},
    {bracket: Infinity, tax: 0.15}
]

//let calculateYukonTax
let calculateYukonTax = income => calculateTax(income, yukonTaxBrackets)



let useCalculateTotalTax = () => {
    const [totalIncome, setTotalIncome] = useState(0)
    const [location, setLocation] = useState("[no location yet]")
    const [provTax, setProvTax] = useState(0)
    const [fedTax, setFedTax] = useState(0)
    const [cppAmount, setCppAmount] = useState(0)
    const [eiAmount, setEiAmount] = useState(0)
    const [totalTax, setTotalTax] = useState(0)
    const [taxPercentage, setTaxPercentage] = useState(0)
    const [incomeAfterTax, setIncomeAfterTax] = useState(0)

    let calculateTotalTax = ({ province, income }) => {
        const provincesMethods = {
            AB: calculateAlbertaTax,
            BC: calculateBcTax,
            MB: calculateManitobaTax,
            NB: calculateNbTax,
            NL: calculateNlTax,
            NT: calculateNwtTax,
            NS: calculateNsTax,
            PE: calculatePeiTax,
            NU: calculateNunavutTax,
            ON: calculateOntarioTax,
            SK: calculateSaskatchewanTax,
            YT: calculateYukonTax
        }
    
        if (!provincesMethods[province] || income < 0) return
    
        let cppContribution = income < 3500 ? 0 : (income >= 3500 && income <= 57400) ? income*0.051 : 2748.90
        
        let eiContribution = income <= 56300 ? income*0.018 : 889.54
        
        let provinceTax = provincesMethods[province](income)
        let federalTax = calculateFederalTax(income)
        let totalTaxResult = provinceTax + federalTax + cppContribution + eiContribution


        setTotalIncome(income)
        setLocation(province)
        setProvTax(provinceTax)
        setFedTax(federalTax)
        setCppAmount(cppContribution)
        setEiAmount(eiContribution)
        setTotalTax(totalTaxResult)
        setTaxPercentage(Math.round(100*((totalTaxResult/income) *100))/100)
        setIncomeAfterTax(Math.round(100*(income-totalTaxResult))/100)
    }

    return {
        calculateTotalTax,
        totalIncome,
        location,
        provTax,
        fedTax,
        cppAmount,
        eiAmount,
        totalTax,
        taxPercentage,
        incomeAfterTax
    }

}



//let calculateTaxInAllProvinces
// let calculateTaxInAllProvinces = income => [
//     'AB', 
//     'BC', 
//     'MB', 
//     'NB', 
//     'NL', 
//     'NT', 
//     'NS', 
//     'PE', 
//     'NU', 
//     'ON', 
//     'SK', 
//     'YT'
// ].forEach(location => calculateTotalTax(location, income)) 


export {
  printDollarAmount,
  useCalculateTotalTax,
//   calculateTaxInAllProvinces
}