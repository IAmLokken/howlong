'use strict'
;(function()
{
    window.HL = {};

    HL.strMultiplier = 1.3;
    HL.fraMultiplier = 1.3;
    HL.lusMultiplier = 1.5;

    HL.bossHP = 0;
    HL.playerBaseDPS = 0;
    HL.bossIndex = 0;

    HL.BossInfo = {};
    HL.JobInfo = {};

    HL.CalculateTime = function()
    {
        let strDuration = ~~document.getElementById("Strength").value;
        let fraDuration = ~~document.getElementById("Frailty").value;
        let lusDuration = ~~document.getElementById("Lust").value;

        console.log(strDuration);
        console.log(fraDuration);
        console.log(lusDuration);

        let strDPS = HL.playerBaseDPS * 1.3;
        let fraDPS = HL.playerBaseDPS * 1.3;
        let strfraDPS = strDPS * 1.3;
        let lusDPS = HL.playerBaseDPS * 1.5;
        let strlusDPS = strDPS * 1.5;

        let baseTime = (HL.bossHP / HL.playerBaseDPS / 60);
        console.log("Time to kill on base damage: " + baseTime);

        // STRENGTH CALCULATION
        if (strDuration > 0 && fraDuration == 0 && lusDuration == 0)
        {
            let time = 0;
            let strengthTime = (HL.bossHP / strDPS / 60);
            if (strengthTime > strDuration)
            {
                let hpRemovedByStrength = (strDPS * 60 * strDuration);
                let remainingHP = HL.bossHP - hpRemovedByStrength;
                time = ((hpRemovedByStrength / strDPS / 60) + (remainingHP / HL.playerBaseDPS / 60));
                console.log("Time to kill on strength duration (" + strDuration +"): " + time);
                return time;
            }
            else
            {
                console.log("Time to kill on strength duration (" + strDuration + "):" + strengthTime);
                return strengthTime;
            }
        }

        //FRAILTY CALCULATION
        if (fraDuration > 0 && strDuration == 0 && lusDuration == 0)
        {
            let time = 0;
            let frailtyTime = (HL.bossHP / fraDPS / 60);
            if (frailtyTime > fraDuration)
            {
                let hpRemovedByFrailty = (fraDPS * 60 * fraDuration);
                let remainingHP = HL.bossHP - hpRemovedByFrailty;
                time = ((hpRemovedByFrailty / fraDPS / 60) + (remainingHP / HL.playerBaseDPS / 60));
                console.log("Time to kill on frailty duration (" + fraDuration +"): " + time);
                return time;
            }
            else
            {
                console.log("Time to kill on frailty duration (" + fraDuration + "): " + frailtyTime);
                return frailtyTime;
            }
        }

        //LUST CALCULATION
        if (lusDuration > 0 && strDuration == 0 && fraDuration == 0)
        {
            let time = 0;
            let lustTime = (HL.bossHP / lusDPS / 60);
            if (lustTime > lusDuration)
            {
                let hpRemovedByLust = (lusDPS * 60 * lusDuration);
                let remainingHP = HL.bossHP - hpRemovedByLust;
                time = ((hpRemovedByLust / lusDPS / 60) + (remainingHP / HL.playerBaseDPS / 60));
                console.log("Time to kill on lust duration (" + lusDuration +"): " + time);
                return time;
            }
            else
            {
                console.log("Time to kill on lust duration (" + lusDuration + "): " + lustTime);
                return lustTime;
            }
        }

        // STRENGTH FRAILTY CALCULATION
        if (strDuration > 0 && fraDuration > 0)
        {
            let time = 0;

            if (fraDuration > strDuration)
            {
                let hpRemovedByStrengthFrailty = (strfraDPS * 60 * strDuration);
                if (hpRemovedByStrengthFrailty > HL.bossHP)
                {
                    time = HL.bossHP / strfraDPS / 60;
                }
                else
                {
                    let hpRemovedbyFrailty = (fraDPS * 60 * (fraDuration - strDuration));
                    if (hpRemovedByStrengthFrailty + hpRemovedbyFrailty > HL.bossHP)
                    {
                        let remainingHP = HL.bossHP - hpRemovedByStrengthFrailty;
                        time = (hpRemovedByStrengthFrailty / strfraDPS / 60) + (remainingHP / fraDPS / 60);
                    }
                    else
                    {
                        let remainingHP = HL.bossHP - hpRemovedByStrengthFrailty - hpRemovedbyFrailty;
                        time = ((hpRemovedByStrengthFrailty / strfraDPS / 60) + (hpRemovedbyFrailty / fraDPS / 60) + (remainingHP / HL.playerBaseDPS / 60));
                    }
                }
                console.log("Time to kill on strength (" + strDuration + ") and frailty (" + fraDuration + "): " + time);
                return time;
            }
            else if(strDuration > fraDuration)
            {
                let hpRemovedByStrengthFrailty = (strfraDPS * 60 * fraDuration);
                console.log("HP removed by strfr: " + hpRemovedByStrengthFrailty);
                if (hpRemovedByStrengthFrailty > HL.bossHP)
                {
                    time = HL.bossHP / strfraDPS / 60;
                }
                else
                {
                    let hpRemovedbyStrength = (strDPS * 60 * (strDuration - fraDuration));
                    if (hpRemovedByStrengthFrailty + hpRemovedbyStrength > HL.bossHP)
                    {
                        console.log("HP removed by strength: " + hpRemovedbyStrength);
                        let remainingHP = HL.bossHP - hpRemovedByStrengthFrailty;
                        time = (hpRemovedByStrengthFrailty / strfraDPS / 60) + (remainingHP / strDPS / 60);
                    }
                    else
                    {
                        let remainingHP = HL.bossHP - hpRemovedByStrengthFrailty - hpRemovedbyStrength;
                        time = ((hpRemovedByStrengthFrailty / strfraDPS / 60) + (hpRemovedbyStrength / strDPS / 60) + (remainingHP / HL.playerBaseDPS / 60));
                    }
                }
                console.log("Time to kill on strength (" + strDuration + ") and frailty (" + fraDuration + "): " + time);
                return time;
            }
            else
            {
                let hpRemovedByStrengthFrailty = (strfraDPS * 60 * strDuration);
                if (hpRemovedByStrengthFrailty > HL.bossHP)
                {
                    time = HL.bossHP / strfraDPS / 60;
                }
                else
                {
                    let remainingHP = HL.bossHP - hpRemovedByStrengthFrailty;
                    time = ((hpRemovedByStrengthFrailty / strfraDPS / 60) + (remainingHP / HL.playerBaseDPS / 60));
                }
                console.log("Time to kill on strength (" + strDuration + ") and frailty (" + fraDuration + "): " + time);
                return time;
            }
        }

        // STRENGTH LUST CALCULATION
        if (strDuration > 0 && lusDuration > 0)
        {
            let time = 0;

            if (lusDuration > strDuration)
            {
                let hpRemovedByStrengthLust = (strlusDPS * 60 * strDuration);
                if (hpRemovedByStrengthLust > HL.bossHP)
                {
                    time = HL.bossHP / strlusDPS / 60;
                }
                else
                {
                    let hpRemovedbyLust = (lusDPS * 60 * (lusDuration - strDuration));
                    if (hpRemovedByStrengthLust + hpRemovedbyLust > HL.bossHP)
                    {
                        let remainingHP = HL.bossHP - hpRemovedByStrengthLust;
                        time = (hpRemovedByStrengthLust / strlusDPS / 60) + (remainingHP / lusDPS / 60);
                    }
                    else
                    {
                        let remainingHP = HL.bossHP - hpRemovedByStrengthLust - hpRemovedbyLust;
                        time = ((hpRemovedByStrengthLust / strlusDPS / 60) + (hpRemovedbyLust / lusDPS / 60) + (remainingHP / HL.playerBaseDPS / 60));
                    }
                }
                console.log("Time to kill on strength (" + strDuration + ") and lust (" + lusDuration + "): " + time);
                return time;
            }
            else if(strDuration > lusDuration)
            {
                let hpRemovedByStrengthLust = (strlusDPS * 60 * lusDuration);
                if (hpRemovedByStrengthLust > HL.bossHP)
                {
                    time = HL.bossHP / strlusDPS / 60;
                }
                else
                {
                    let hpRemovedbyStrength = (strDPS * 60 * (strDuration - lusDuration));
                    if (hpRemovedByStrengthLust + hpRemovedbyStrength > HL.bossHP)
                    {
                        let remainingHP = HL.bossHP - hpRemovedByStrengthLust;
                        time = (hpRemovedByStrengthLust / strlusDPS / 60) + (remainingHP / strDPS / 60);
                    }
                    else
                    {
                        let remainingHP = HL.bossHP - hpRemovedByStrengthLust - hpRemovedbyStrength;
                        time = ((hpRemovedByStrengthLust / strlusDPS / 60) + (hpRemovedbyStrength / strDPS / 60) + (remainingHP / HL.playerBaseDPS / 60));
                    }
                }
                console.log("Time to kill on strength (" + strDuration + ") and lust (" + lusDuration + "): " + time);
                return time;
            }            
            else
            {
                let hpRemovedByStrengthLust = (strlusDPS * 60 * strDuration);
                if (hpRemovedByStrengthLust > HL.bossHP)
                {
                    time = HL.bossHP / strlusDPS / 60;
                }
                else
                {
                    let remainingHP = HL.bossHP - hpRemovedByStrengthLust;
                    time = ((hpRemovedByStrengthLust / strlusDPS / 60) + (remainingHP / HL.playerBaseDPS / 60));
                }
                console.log("Time to kill on strength (" + strDuration + ") and lust (" + lusDuration + "): " + time);
                return time;
            } 
        } 

        return baseTime;
    }

    HL.PopulateDungeonDropdown = function()
    {
        let dungeonDropDown = document.getElementById("DeepDungeon");

        let potdOption = document.createElement("option");
        potdOption.text = "Palace of the Dead";
        let hohOption = document.createElement("option");
        hohOption.text = "Heaven-on-High";
        dungeonDropDown.add(potdOption, dungeonDropDown[0]);
        dungeonDropDown.add(hohOption, dungeonDropDown[1]);
    }

    HL.DungeonSelected = function(index, value)
    {
        HL.HideAll();
        HL.ClearAll();

        let jobDropDown = document.getElementById("Job");
        console.log(HL.JobInfo.HOH.length);

        let jobList = value == "Palace of the Dead" ? HL.JobInfo.POTD : HL.JobInfo.HOH;
        
        for (var i = 0; i < jobList.length; i++)
        {
            if (jobList[i].DPS){
                let x = document.createElement("option");
                x.text = jobList[i].JOB;
                x.value = i;
                jobDropDown.add(x, i);
            }
        }
        
        jobDropDown.classList.remove("hide");
    }
    HL.JobSelected = function(index, value)
    {
        let selectedDungeon = document.getElementById("DeepDungeon").value;
        let bossDropdown = document.getElementById("Boss");
        let dpstext = document.getElementById("DPS");
        let strDiv = document.getElementById("strdiv");
        let fraDiv = document.getElementById("fradiv");
        let lusDiv = document.getElementById("lusdiv");

        HL.ClearDropdown(bossDropdown, "Select Boss");

        strDiv.classList.add('hide');
        fraDiv.classList.add('hide');
        lusDiv.classList.add('hide');
        strDiv.classList.remove('inlineblock');
        fraDiv.classList.remove('inlineblock');
        lusDiv.classList.remove('inlineblock');

        let bossList = selectedDungeon == "Palace of the Dead" ? HL.BossInfo.POTD : HL.BossInfo.HOH;
        let jobList = selectedDungeon == "Palace of the Dead" ? HL.JobInfo.POTD : HL.JobInfo.HOH;

        for (var i = 0; i < bossList.length; i++)
        {
            if(bossList[i].HP)
            {
                let x = document.createElement("option");
                x.text = bossList[i].Name;
                x.value = i;
                bossDropdown.add(x, i);
            }
        }

        dpstext.value = jobList[value].DPS;
        HL.playerBaseDPS = jobList[value].DPS;

        bossDropdown.classList.remove('hide');        
    }
    HL.BossSelected = function(index, value)
    {
        let selectedDungeon = document.getElementById("DeepDungeon").value;
        let selectedJob = document.getElementById("Job").value;
        let strengthInput = document.getElementById("Strength");
        let frailtyInput = document.getElementById("Frailty");
        let lustInput = document.getElementById("Lust");
        let dpstext = document.getElementById("DPS");
        let strDiv = document.getElementById("strdiv");
        let fraDiv = document.getElementById("fradiv");
        let lusDiv = document.getElementById("lusdiv");

        strengthInput.value = 0;
        frailtyInput.value = 0;
        lustInput.value = 0;

        let bossList = selectedDungeon == "Palace of the Dead" ? HL.BossInfo.POTD : HL.BossInfo.HOH;
        let jobList = selectedDungeon == "Palace of the Dead" ? HL.JobInfo.POTD : HL.JobInfo.HOH;

        strDiv.classList.remove('hide');
        strDiv.classList.add('inlineblock');

        if (selectedDungeon == "Palace of the Dead")
        {

            lusDiv.classList.remove('hide');
            lusDiv.classList.add('inlineblock');
            fraDiv.classList.remove('inlineblock');
            fraDiv.classList.add('hide');            
        }
        if (selectedDungeon == "Heaven-on-High")
        {
            fraDiv.classList.remove('hide');
            fraDiv.classList.add('inlineblock');
            lusDiv.classList.remove('inlineblock');
            lusDiv.classList.add('hide');
        }

        HL.bossHP = bossList[value].HP;
        HL.playerBaseDPS = jobList[selectedJob].DPS / bossList[value].MOD;
        HL.bossIndex = value;
        dpstext.value = HL.playerBaseDPS;
        console.log(HL.bossIndex);
        if(HL.bossIndex == 14)
            HL.OutputTimeToKill(HL.CalculateTimeWithAdds(105, 29000, 1));
        else if (HL.bossIndex == 11)
            HL.OutputTimeToKill(HL.CalculateTimeWithAdds(60, 7000, 2));
        else
            HL.OutputTimeToKill(HL.CalculateTime());
    }
    HL.StrengthSelected = function(value)
    {
        if(HL.bossIndex == 14)
            HL.OutputTimeToKill(HL.CalculateTimeWithAdds(105, 29000, 1));
        else if (HL.bossIndex == 11)
            HL.OutputTimeToKill(HL.CalculateTimeWithAdds(60, 7000, 2));
        else
            HL.OutputTimeToKill(HL.CalculateTime());
    }
    HL.FrailtySelected = function(index, value)
    {
        if(HL.bossIndex == 14)
            HL.OutputTimeToKill(HL.CalculateTimeWithAdds(105, 29000, 1));
        else if (HL.bossIndex == 11)
            HL.OutputTimeToKill(HL.CalculateTimeWithAdds(60, 7000, 2));
        else
            HL.OutputTimeToKill(HL.CalculateTime());
    }
    HL.LustSelected = function(index, value)
    {
        if(HL.bossIndex == 14)
            HL.OutputTimeToKill(HL.CalculateTimeWithAdds(105, 29000, 1));
        else if (HL.bossIndex == 11)
            HL.OutputTimeToKill(HL.CalculateTimeWithAdds(60, 7000, 2));
        else
            HL.OutputTimeToKill(HL.CalculateTime());
    }

    HL.ClearDropdown = function(element, defaultValue)
    {
        var i, L = element.options.length - 1;
        for(i = L; i >= 0; i--) {
            element.remove(i);
        }         
        var option = document.createElement("option");
        option.text = defaultValue;
        option.selected = true;
        option.disabled = true;
        option.hidden = true;
        option.value = 0;
        element.add(option);
    }
    HL.ClearAll = function()
    {
        HL.ClearDropdown(document.getElementById("Boss"), "Select Boss");
        HL.ClearDropdown(document.getElementById("Job"), "Select Job");
        document.getElementById("Strength").value = 0;
        document.getElementById("Frailty").value = 0;
        document.getElementById("Lust").value = 0;
    }
    HL.HideAll = function()
    {
        document.getElementById("Job").classList.add("hide");
        document.getElementById("Boss").classList.add("hide");

        document.getElementById("strdiv").classList.remove("inlineblock");
        document.getElementById("fradiv").classList.remove("inlineblock");
        document.getElementById("lusdiv").classList.remove("inlineblock");
        document.getElementById("strdiv").classList.add("hide");
        document.getElementById("fradiv").classList.add("hide");
        document.getElementById("lusdiv").classList.add("hide");
    }

    HL.OutputTimeToKill = function(number)
    {
        console.log(number);
        // Check sign of given number
        var sign = (number >= 0) ? 1 : -1;
    
        // Set positive value of number of sign negative
        number = number * sign;
    
        // Separate the int from the decimal part
        var hour = Math.floor(number);
        var decpart = number - hour;
    
        var min = 1 / 60;
        // Round to nearest minute
        decpart = min * Math.round(decpart / min);
    
        var minute = Math.floor(decpart * 60) + '';
    
        // Add padding if need
        if (minute.length < 2) {
        minute = '0' + minute; 
        }
    
        // Add Sign in final result
        sign = sign == 1 ? '' : '-';
    
        // Concate hours and minutes
        let time = sign + hour + ':' + minute;
    
        let ttkLabel = document.getElementById("TTK");
        ttkLabel.innerHTML = time;
    }

    HL.Round = function(number){
        return Math.round((number + Number.EPSILON) * 100) / 100;
    }

    HL.CalculateTimeWithAdds = function(addInterval, addHP, addNumber)
    {
        let initialTime = HL.CalculateTime() * 60;
        console.log("Initial time: " + initialTime);
        let initialHP = ~~HL.bossHP;
        let initialAddCount = Math.floor(initialTime / addInterval * addNumber);
        console.log("Initial Add count: " + initialAddCount);
        let currentAddCount = initialAddCount;
        let previousAddCount = initialAddCount;
        let finalTime = initialTime;
        do{
            let additionalHP = addHP * addNumber * currentAddCount;
            HL.bossHP = initialHP + additionalHP;
            console.log("Boss HP: " + HL.bossHP);
            console.log("Additional HP: " + additionalHP);
            console.log("New boss hp: " + HL.bossHP);

            finalTime = HL.CalculateTime() * 60;

            previousAddCount = currentAddCount;
            currentAddCount = Math.floor(finalTime / addInterval);
        } while (currentAddCount > previousAddCount)

        HL.bossHP = initialHP;
        return finalTime / 60;
    }
})()