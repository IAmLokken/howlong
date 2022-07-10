'use strict'
;(function()
{
    window.HL = {};

    HL.strMultiplier = 1.3;
    HL.fraMultiplier = 1.3;
    HL.lusMultiplier = 1.5;

    HL.bossHP = 0;
    HL.playerBaseDPS = 0;

    HL.BossInfo = {};
    HL.JobInfo = {};

    HL.CalculateTime = function()
    {
        let strDuration = document.getElementById("Strength").options[document.getElementById("Strength").selectedIndex].value;
        let fraDuration = document.getElementById("Frailty").options[document.getElementById("Frailty").selectedIndex].value;
        let lusDuration = document.getElementById("Lust").options[document.getElementById("Lust").selectedIndex].value;

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
            let strengthFrailtyTime = (HL.bossHP / strfraDPS / 60);

            if (fraDuration > strDuration && strengthFrailtyTime > fraDuration)
            {
                let hpRemovedByStrengthFrailty = (strfraDPS * 60 * strDuration);
                let fraHP = HL.bossHP - hpRemovedByStrengthFrailty;
                let hpRemovedbyFrailty = (fraDPS * 60 * fraDuration - strDuration);
                let remainingHP = fraHP - hpRemovedbyFrailty;
                if (remainingHP > 0)
                {
                    time = ((hpRemovedByStrengthFrailty / strfraDPS / 60) + (fraHP / fraDPS / 60) + (remainingHP / HL.playerBaseDPS / 60));
                }
                else
                {
                    time = ((hpRemovedByStrengthFrailty / strfraDPS / 60) + (remainingHP / fraDPS / 60));
                }
                console.log("Time to kill on strength (" + strDuration + ") and frailty (" + fraDuration + "): " + time);
                return time;
            }
            if(fraDuration < strDuration && strengthFrailtyTime > strDuration)
            {
                let hpRemovedByStrengthFrailty = (strfraDPS * 60 * fraDuration);
                let strHP = HL.bossHP - hpRemovedByStrengthFrailty;
                let hpRemovedbyStrength = (strDPS * 60 * strDuration - fraDuration);
                let remainingHP = strHP - hpRemovedbyStrength;
                if (remainingHP > 0)
                {
                    time = ((hpRemovedByStrengthFrailty / strfraDPS / 60) + (strHP / strDPS / 60) + (remainingHP / HL.playerBaseDPS / 60));
                }
                else
                {
                    time = ((hpRemovedByStrengthFrailty / strfraDPS / 60) + (remainingHP / strDPS / 60));
                }
                console.log("Time to kill on strength (" + strDuration + ") and frailty (" + fraDuration + "): " + time);
                return time;
            }
            if (fraDuration == strDuration)
            {
                let hpRemovedByStrengthFrailty = (strfraDPS * 60 * strDuration).toFixed();
                let remainingHP = bossHP - hpRemovedByStrengthFrailty;
                time = ((hpRemovedByStrengthFrailty / strfraDPS / 60) + (remainingHP / HL.playerBaseDPS / 60));
                console.log("Time to kill on strength (" + strDuration + ") and frailty (" + fraDuration + "): " + time);
                return time;
            }

            else
            {
                console.log("Time to kill on strength (" + strDuration + ") and frailty (" + fraDuration + "): " + strengthFrailtyTime);
                return strengthFrailtyTime;
            }
        }

        // STRENGTH LUST CALCULATION
        if (strDuration > 0 && lusDuration > 0)
        {
            let time = 0;
            let strengthLustTime = (HL.bossHP / strlusDPS / 60);

            if (lusDuration > strDuration && strengthLustTime > lusDuration)
            {
                let hpRemovedByStrengthLust = (strlusDPS * 60 * strDuration);
                let lusHP = HL.bossHP - hpRemovedByStrengthLust;
                let hpRemovedbyLust = (lusDPS * 60 * lusDuration - strDuration);
                let remainingHP = lusHP - hpRemovedbyLust;
                if (remainingHP > 0)
                {
                    time = ((hpRemovedByStrengthLust / strlusDPS / 60) + (lusHP / lusDPS / 60) + (remainingHP / HL.playerBaseDPS / 60));
                }
                else
                {
                    time = ((hpRemovedByStrengthLust / strlusDPS / 60) + (remainingHP / lusDPS / 60));
                }
                console.log("Time to kill on strength (" + strDuration + ") and lust (" + lusDuration + "): " + time);
                return time;
            }
            if(lusDuration < strDuration && strengthLustTime > strDuration)
            {
                let hpRemovedByStrengthLust = (strlusDPS * 60 * lusDuration);
                let strHP = HL.bossHP - hpRemovedByStrengthLust;
                let hpRemovedbyStrength = (strDPS * 60 * strDuration - lusDuration);
                let remainingHP = strHP - hpRemovedbyStrength;
                if (remainingHP > 0)
                {
                    time = ((hpRemovedByStrengthLust / strlusDPS / 60) + (strHP / strDPS / 60) + (remainingHP / HL.playerBaseDPS / 60));
                }
                else
                {
                    time = ((hpRemovedByStrengthLust / strlusDPS / 60) + (remainingHP / strDPS / 60));
                }
                console.log("Time to kill on strength (" + strDuration + ") and lust (" + lusDuration + "): " + time);
                return time;
            }
            if (lusDuration == strDuration)
            {
                let hpRemovedByStrengthLust = (strlusDPS * 60 * strDuration).toFixed();
                let remainingHP = bossHP - hpRemovedByStrengthLust;
                time = ((hpRemovedByStrengthLust / strlusDPS / 60) + (remainingHP / HL.playerBaseDPS / 60));
                console.log("Time to kill on strength (" + strDuration + ") and lust (" + lusDuration + "): " + time);
                return time;
            }
        } 
        else
        {
            console.log("Time to kill on strength (" + strDuration + ") and lust (" + lusDuration + "): " + strengthLustTime);
            return strengthLustTime;
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
        let strengthDropdown = document.getElementById("Strength");
        let frailtyDropdown = document.getElementById("Frailty");
        let lustDropdown = document.getElementById("Lust");
        let dpstext = document.getElementById("DPS");

        HL.ClearDropdown(bossDropdown, "Select Boss");

        strengthDropdown.classList.add('hide');
        frailtyDropdown.classList.add('hide');
        lustDropdown.classList.add('hide');

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
        let strengthDropdown = document.getElementById("Strength");
        let frailtyDropdown = document.getElementById("Frailty");
        let lustDropdown = document.getElementById("Lust");

        HL.ClearDropdown(strengthDropdown, "Select Strength Uptime");
        HL.ClearDropdown(frailtyDropdown, "Select Frailty Uptime");
        HL.ClearDropdown(lustDropdown, "Select Lust Uptime");

        let bossList = selectedDungeon == "Palace of the Dead" ? HL.BossInfo.POTD : HL.BossInfo.HOH;

        for (var i = 0; i < 4; i++)
        {
            let x = document.createElement("option");
            x.text = (i * 8).toString() + " minutes";
            x.value = i * 8;
            strengthDropdown.add(x, i);
        }

        strengthDropdown.classList.remove('hide');

        if (selectedDungeon == "Palace of the Dead")
        {
            for (var i = 0; i < 4; i++)
            {
                let x = document.createElement("option");
                x.text = (i * 1.5).toString() + " minutes";
                x.value = i * 1.5;
                lustDropdown.add(x, i);
            }
            lustDropdown.classList.remove('hide');
            frailtyDropdown.classList.add('hide');
        }
        if (selectedDungeon == "Heaven-on-High")
        {
            for (var i = 0; i < 4; i++)
            {
                let x = document.createElement("option");
                x.text = (i * 3).toString() + " minutes";
                x.value = i * 3;
                frailtyDropdown.add(x, i);
            }
            frailtyDropdown.classList.remove('hide');
            lustDropdown.classList.add('hide');
        }

        HL.bossHP = bossList[value].HP;
        HL.OutputTimeToKill(HL.CalculateTime());
    }
    HL.StrengthSelected = function(index, value)
    {
        HL.OutputTimeToKill(HL.CalculateTime());
    }
    HL.FrailtySelected = function(index, value)
    {
        HL.OutputTimeToKill(HL.CalculateTime());
    }
    HL.LustSelected = function(index, value)
    {
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
        HL.ClearDropdown(document.getElementById("Strength"), "Select Strength Uptime");
        HL.ClearDropdown(document.getElementById("Frailty"), "Select Frailty Uptime");
        HL.ClearDropdown(document.getElementById("Lust"), "Select Lust Uptime");
    }
    HL.HideAll = function()
    {
        document.getElementById("Job").classList.add("hide");
        document.getElementById("Boss").classList.add("hide");
        document.getElementById("Strength").classList.add("hide");
        document.getElementById("Frailty").classList.add("hide");
        document.getElementById("Lust").classList.add("hide");
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
})()