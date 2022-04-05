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
    baseBoundPrice = 4500
    tierTwoBoundPrice = 1
    baseAltaPrice = 3500
    tierTwoAltaPrice = .25
    liftMin = 2500
    liftMax = 3750
    initLiftMin = 3750
    initLiftMax = 4500

  } else if (sharingStatus === 'PUBLIC') {

    basePlatPrice = 640
    tierTwoPlatPrice = 20 
    tierThreePlatPrice = 10
    baseBoundPrice = 600
    tierTwoBoundPrice = 1
    baseAltaPrice = 500
    tierTwoAltaPrice = .25

  }

/*
===========================================
BAT CALCULATOR PRICING FUNCTION
===========================================
*/



  function calcBatSubtotalPrice(item) {

    const boundaryUnits = document.querySelector('#est-boundary-lf').value
    const acreageUnits = document.querySelector('#est-acreage-ac').value
    const lidarDiffFactor = document.querySelector('#est-lidar-diff').value
    const lidarWeight = document.querySelector('#est-lidar-weight').value
    const boundNeeded = document.querySelector('#est-bound-bool').checked
    const altaNeeded = document.querySelector('#est-alta-bool').checked
    const topoNeeded = document.querySelector('#est-topo-bool').checked
    
    let subtotal = 0
    let liftMultiplier = ((liftMax / liftMin) - 1) / 4 * (lidarDiffFactor - 1) + 1
    let initLiftMultiplier = ((initLiftMax / initLiftMin) - 1) / 4 * (lidarDiffFactor - 1) + 1
    let pricePerLift = liftMultiplier * liftMin
    let priceInitLift = initLiftMultiplier * initLiftMin 
    let addLifts = Math.round((acreageUnits * 43560) / (3500 * 350))

    if (item === 'boundary-price') {
      if (boundNeeded === true) {
        if (boundaryUnits <= 4500 && boundaryUnits > 0) {
          subtotal = baseBoundPrice
        } else if (boundaryUnits > 4500) {
          subtotal = boundaryUnits * tierTwoBoundPrice
        }
      }
    } else if (item === 'alta-price') {
      if (altaNeeded === true) {
        if (boundaryUnits <= 14000 && boundaryUnits > 0) {
          subtotal = baseAltaPrice
        } else if (boundaryUnits > 14000) {
          subtotal = boundaryUnits * tierTwoAltaPrice
        }
      }
    } else if (item === 'topo-price') {
      if (topoNeeded === true) {
        if (acreageUnits > 0) {
          subtotal = priceInitLift + (addLifts * pricePerLift)
        }
      } 
    }
    return Math.ceil(subtotal/10) * 10
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

    return Math.ceil(subtotal/10) * 10

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

    let subtotalArray = createArrayFromSubtotals ()
    outputSubtotals()

    let estimatedPrice = subtotalArray.reduce((p, a) => p + a, 0).toFixed(2);

    document.querySelector('#estimatedPrice').innerText = estimatedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

/*
===========================================
CREATE ARRAY FROM INPUTS FUNCTION
===========================================
*/
  
  function createEstimateItemsArray () {
    const elem = document.getElementsByClassName("est-item")
    const quoteItems = []
    for (let i = 0; i < elem.length; ++i) {
      if (typeof elem[i].id !== "undefined") {
        quoteItems.push(elem[i].id)
      }
    }
    return quoteItems
  }

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
    let arrayEstimateItems = createEstimateItemsArray ()
    let subtotalArray = []
    let subtotal = 0

    if (deptSelect === 'BAT') {
      arrayEstimateItems.forEach(item => {
        subtotal = calcBatSubtotalPrice(item)
        subtotalArray.push(subtotal)
      })
    } else if (deptSelect === 'PLAT') {
      arrayUnitCounts.forEach (units => {
        subtotal = calcPlatSubtotalPrice(units)
        subtotalArray.push(subtotal)
      }
    )}
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
      document.querySelector(`tbody > :nth-child(${i}) .subtotal`).innerHTML = subtotalArray[i - 1].toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    let newRow = `<tr><td><input class="phase-num" type="text" value="PHASE 1"></td><td><input class="units" type="number" value=""></td><td>SEE PRICING MATRIX</td><td>$ <strong class="subtotal">0.00</strong></td></tr>`

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
    let newRow = '<tr><td><input class="phase-num" type="text" value="PHASE 1"></td><td><input class="units" type="number" value=""></td><td>SEE PRICING MATRIX</td><td>$ <strong class="subtotal">0.00</strong></td></tr>'
    
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