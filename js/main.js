/*=======================================*/
/*        TESTING AND PUBLIC FILE        */
/*=======================================*/

/*
===========================================
VERSION NUMBER
===========================================
*/

  let sharingStatus = document.querySelector('.fileSpecifier').textContent
  let versionNum = ''

  if (sharingStatus === 'PRIVATE') {
    versionNum = '(BETA) Version T-1.00.04'
    document.querySelector('.version-number').innerHTML = versionNum
  } else if (sharingStatus === 'PUBLIC') {
    versionNum = '(BETA) Version P-1.00.03'
    document.querySelector('.version-number').innerHTML = versionNum
  }

/*
===========================================
DEPARTMENT VARIABLE SPECIFIER
===========================================
*/

  let deptSelect = document.querySelector('.deptSpecifier').textContent

/*
===========================================
PUBLIC VS. PRIVATE VALUES
===========================================
*/

  // sharingStatus defined in VERSION NUMBER

  let basePlatPrice
  let tierTwoPlatPrice
  let tierThreePlatPrice
  
  if (sharingStatus === 'PRIVATE') {
    
    basePlatPrice = 4000
    tierTwoPlatPrice = 125 
    tierThreePlatPrice = 100

  } else if (sharingStatus === 'PUBLIC') {

    basePlatPrice = 640
    tierTwoPlatPrice = 20 
    tierThreePlatPrice = 10
  }

/*
===========================================
BAT CALCULATOR PRICING FUNCTION
===========================================
*/

  function calcBatSubtotalPrice(units) {

    subtotal = units * 1.25
    return subtotal

  }

/*
===========================================
PLAT CALCULATOR PRICING FUNCTION
===========================================
*/

  function calcPlatSubtotalPrice(units) {

    if (units <=32 && units > 0) {
      subtotal = basePlatPrice
    } else if (units > 32 && units <= 100) {
      subtotal = units * tierTwoPlatPrice
    } else if (units > 100) {
      subtotal = 100 * tierTwoPlatPrice + (units - 100) * tierThreePlatPrice
    } else {
      subtotal = 0
    }

    return subtotal

  }

/*
===========================================
CALC ESTIMATED PRICE FUNCTION
===========================================
*/

  document.querySelector('#calculatePrice').addEventListener('click', calcEstimatedPrice)
  document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      calcEstimatedPrice();
    }
  });

  function calcEstimatedPrice () {

    let subtotalArray = []

    if (deptSelect === 'BAT') {
      /* BAT FUNCTIONS HERE*/
    } else if (deptSelect === 'PLAT') {
      subtotalArray = createArrayFromSubtotals ()
      outputSubtotals()
    }

    let estimatedPrice = subtotalArray.reduce((p, a) => p + a, 0);

    document.querySelector('#estimatedPrice').innerText = estimatedPrice.toFixed(2)
  }

/*
===========================================
CREATE ARRAY FROM INPUTS FUNCTION
===========================================
*/

  function createArrayFromInputs () {
    const elem = document.getElementsByClassName("units")
    const arrayUnitCounts = []
    for (let i = 0; i < elem.length; ++i) {
      if (typeof elem[i].value !== "undefined") {
          arrayUnitCounts.push(elem[i].value)
        }
      }
    return arrayUnitCounts
  }

/*
===========================================
CREATE ARRAY FROM OUTPUTS FUNCTION
===========================================
*/  

  function createArrayFromSubtotals () {

    let arrayUnitCounts = createArrayFromInputs ()
    let subtotalArray = []

    arrayUnitCounts.forEach (units => {
      if (deptSelect === 'BAT') {
        calcBatSubtotalPrice(units)
      } else if (deptSelect === 'PLAT') {
        calcPlatSubtotalPrice(units)
      }
      subtotalArray.push(subtotal)
    })
    return subtotalArray
  }

/*
===========================================
OUTPUT SUBTOTALS FUNCTION
===========================================
*/

  function outputSubtotals () {
    
    let subtotalArray = createArrayFromSubtotals ()
    for (let i = 1; i <= subtotalArray.length; ++i) {
      document.querySelector(`tbody > :nth-child(${i}) .subtotal`).innerHTML = subtotalArray[i - 1].toFixed(2)
    }
  }

/*
===========================================
ADD LINE ITEM FUNCTION
===========================================
*/

  document.querySelector('#addLineItem').addEventListener('click', addLineItem)

  function addLineItem () {

    let rowCount = document.getElementById('list-line-item').childElementCount
    let newRow = `<tr><td>PROJECT</td><td><input class="units" type="number" value=""></td><td>SEE PRICING MATRIX</td><td>$ <strong class="subtotal">0</strong></td></tr>`

    document.querySelector('#list-line-item').innerHTML = ""
    for (i = 0; i <= rowCount; i++) {
      document.querySelector('#list-line-item').innerHTML += newRow
    }
  }

/*
===========================================
REMOVE LINE ITEM FUNCTION
===========================================
*/

  document.querySelector('#removeLineItem').addEventListener('click', removeLineItem)

  function removeLineItem () {

    let rowCount = document.getElementById('list-line-item').childElementCount
    let newRow = '<tr><td>PROJECT</td><td><input class="units" type="number" value=""></td><td>SEE PRICING MATRIX</td><td>$ <strong class="subtotal">0</strong></td></tr>'
    
    document.querySelector('#list-line-item').innerHTML = newRow
    for (i = rowCount; i > 2; i--) {
      document.querySelector('#list-line-item').innerHTML += newRow
    }
  }

/*
===========================================
INPUT HOLD FUNCTION (WORK-IN-PROGRESS)
===========================================
*/

  // let valueHold = document.getElementsByClassName('numberOfLots')
  // let inputHoldArray = []
  // for (let i = 0; i < valueHold.length; ++i) {
  //   inputHoldArray.push(valueHold[i].value)
  // }

  // for (let i = 0; i < inputHoldArray.length; i++) {
  //   document.querySelector(`tbody :nth-child(${i+2}) .numberOfLots`).setAttribute('value',inputHoldArray[i])
  // }

  // console.log(inputHoldArray)