let baseDPS = 952.94;
let bossHP = 650263;

let strDPS = baseDPS * 1.3;
let fraDPS = baseDPS * 1.3;
let strfraDPS = strDPS * 1.3;
let lustDPS = baseDPS * 1.5;
let strlustDPS = strDPS * 1.5;

let baseTime = (bossHP / baseDPS / 60).toFixed(2);
console.log("Time to kill on base damage: " + baseTime);

let strengthTime = (bossHP / strDPS / 60).toFixed(2);
console.log("Time to kill on strength damage (full duration): " + strengthTime);
if (strengthTime > 8)
{
	let hpRemovedByStrength = (strDPS * 60 * 8).toFixed();
  let remainingHP = bossHP - hpRemovedByStrength;
  let time = ((hpRemovedByStrength / strDPS / 60) + (remainingHP / baseDPS / 60)).toFixed(2);
  console.log("Time to kill on strength damage: " + time);
}

let frailtyTime = (bossHP / fraDPS / 60).toFixed(2);
console.log("Time to kill on frailty damage (full duration): " + frailtyTime);
if (frailtyTime > 3)
{
	let hpRemovedByFrailty = (fraDPS * 60 * 3).toFixed();
  let remainingHP = bossHP - hpRemovedByFrailty;
  let time = ((hpRemovedByFrailty / fraDPS / 60) + (remainingHP / baseDPS / 60)).toFixed(2);
  console.log("Time to kill on frailty damage: " + time);
}

let strengthFrailtyTime = (bossHP / strfraDPS / 60).toFixed(2);
console.log("Time to kill on strength and frailty damage (full duration): " + strengthFrailtyTime);
if (strengthFrailtyTime > 3 && strengthFrailtyTime < 8 )
{
	let hpRemovedByStrengthFrailty = (strfraDPS * 60 * 3).toFixed();
  let remainingHP = bossHP - hpRemovedByStrengthFrailty;
  let time = ((hpRemovedByStrengthFrailty / strfraDPS / 60) + (remainingHP / strDPS / 60)).toFixed(2);
  console.log("Time to kill on strength and frailty damage: " + time);
}
else if (strengthFrailtyTime > 8)
{
	let hpRemovedByStrengthFrailty = (strfraDPS * 60 * 3).toFixed();
  let hpRemovedByStrength = (strDPS * 60 * 5).toFixed();
  let remainingHP = bossHP - hpRemovedByStrengthFrailty - hpRemovedByStrength;
  let time = ((hpRemovedByStrengthFrailty / strfraDPS / 60) + (hpRemovedByStrength / strDPS / 60) + (remainingHP / baseDPS / 60)).toFixed(2)
  console.log("Time to kill on strength and frailty damage: " + time);
}


let lustTime = (bossHP / lustDPS / 60).toFixed(2);
console.log("Time to kill on lust damage (full duration): " + lustTime);
if (lustTime > 1.5)
{
	let hpRemovedByLust = (lustDPS * 60 * 1.5).toFixed();
  let remainingHP = bossHP - hpRemovedByLust;
  let time = ((hpRemovedByLust / lustDPS / 60) + (remainingHP / baseDPS / 60)).toFixed(2);
  console.log("Time to kill on lust damage: " + time);
}

let strengthLustTime = (bossHP / strlustDPS / 60).toFixed(2);
console.log("Time to kill on strength and lust damage (full duration): " + strengthLustTime);
if (strengthLustTime > 1.5 && strengthLustTime < 8 )
{
	let hpRemovedByStrengthLust = (strlustDPS * 60 * 1.5).toFixed();
  let remainingHP = bossHP - hpRemovedByStrengthLust;
  let time = ((hpRemovedByStrengthLust / strlustDPS / 60) + (remainingHP / strDPS / 60)).toFixed(2);
  console.log("Time to kill on strength and lust damage: " + time);
}
else if (strengthLustTime > 8)
{
	let hpRemovedByStrengthLust = (strlustDPS * 60 * 3).toFixed();
  let hpRemovedByStrength = (strDPS * 60 * 5).toFixed();
  let remainingHP = bossHP - hpRemovedByStrengthLust - hpRemovedByStrength;
  let time = ((hpRemovedByStrengthLust / strlustDPS / 60) + (hpRemovedByStrength / strDPS / 60) + (remainingHP / baseDPS / 60)).toFixed(2)
  console.log("Time to kill on strength and lust damage: " + time);
}




