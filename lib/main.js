'use strict'
;(function()
{
    window.HL = {};

    HL.strMultiplier = 1.3;
    HL.fraMultiplier = 1.3;
    HL.lusMultiplier = 1.5;

    HL.bossHP = 0;
    HL.playerBaseDPS = 0;
    HL.playerAOEDPS = 0;
    HL.lustDPS = 775;
    HL.bossIndex = 0;
    HL.dungeonName = "";

    HL.BossInfo = {};
    HL.JobInfo = {};
    HL.TimelineInfo = {};

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

        HL.dungeonName = value;

        let jobDropDown = document.getElementById("Job");
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
        HL.ClearResults();
    }
    HL.JobSelected = function(index, value)
    {
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
           
        let bossList = HL.dungeonName == "Palace of the Dead" ? HL.BossInfo.POTD : HL.BossInfo.HOH;
        let jobList = HL.dungeonName == "Palace of the Dead" ? HL.JobInfo.POTD : HL.JobInfo.HOH;

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
        HL.playerAOEDPS = parseFloat(jobList[value].AOE) ? parseFloat(jobList[value].AOE) : 0;

        bossDropdown.classList.remove('hide');    
        HL.ClearResults();    
    }
    HL.BossSelected = function(index, value)
    {
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

        let bossList = HL.dungeonName == "Palace of the Dead" ? HL.BossInfo.POTD : HL.BossInfo.HOH;
        let jobList = HL.dungeonName == "Palace of the Dead" ? HL.JobInfo.POTD : HL.JobInfo.HOH;

        strDiv.classList.remove('hide');
        strDiv.classList.add('inlineblock');

        if (HL.dungeonName == "Palace of the Dead")
        {

            lusDiv.classList.remove('hide');
            lusDiv.classList.add('inlineblock');
            fraDiv.classList.remove('inlineblock');
            fraDiv.classList.add('hide');            
        }
        if (HL.dungeonName == "Heaven-on-High")
        {
            fraDiv.classList.remove('hide');
            fraDiv.classList.add('inlineblock');
            lusDiv.classList.remove('inlineblock');
            lusDiv.classList.add('hide');
        }

        HL.bossHP = parseInt(bossList[value].HP);
        HL.playerBaseDPS = jobList[selectedJob].DPS / bossList[value].MOD;
        HL.bossIndex = value;
        dpstext.value = HL.playerBaseDPS;

        HL.ClearResults();
        HL.ProcessTimelines();
     }
    HL.StrengthSelected = function(value)
    {
        HL.ClearResults();
        HL.ProcessTimelines();
    }
    HL.FrailtySelected = function(index, value)
    {
        HL.ClearResults();
        HL.ProcessTimelines();
    }
    HL.LustSelected = function(index, value)
    {
        HL.ClearResults();
        HL.ProcessTimelines();
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
        if (minute == 60)
        {
            minute = '0';
            hour = hour + 1;
        }
    
        // Add padding if need
        if (minute.length < 2) {
        minute = '0' + minute; 
        }
    
        // Add Sign in final result
        sign = sign == 1 ? '' : '-';
    
        // Concate hours and minutes
        let time = sign + hour + ':' + minute;
    
        return time;
    }

    HL.Round = function(number)
    {
        return Math.round((number + Number.EPSILON) * 100) / 100;
    }

    HL.ProcessTimelines = function()
    {
        let floorNumber = (parseInt(HL.bossIndex) + 1) + "0";
        let selectedDungeon = HL.dungeonName == "Heaven-on-High" ? "HOH" : "POTD";
        let jobList = selectedDungeon == "Palace of the Dead" ? HL.JobInfo.POTD : HL.JobInfo.HOH;
        let selectedJobID = document.getElementById("Job").value;
        let selectedJob = jobList[selectedJobID].JOB;
        let lustCount = parseFloat(document.getElementById("Lust").value) / 1.5;

        let timelines = HL.TimelineInfo.TIMELINES[selectedDungeon + floorNumber];
        for (var key in timelines)
        {
            let timeline = timelines[key];
            let jobs = timeline[timeline.length-1].JOBS;

            if (jobs.includes(selectedJob) || jobs.includes("ALL"))
            {
                let lustReserveCount = timeline[timeline.length-1].LUSTRESERVECOUNT;
                
                //if (lustReserveCount <= lustCount)
                //{
                    let notes = timeline[timeline.length-1].NOTES;
                    // Create HTML block 
                    // populate notes and time to kill for timeline
                    let time = HL.CalculateTimeline(timeline);
                    
                    let myDiv = document.createElement('div');
                    myDiv.setAttribute('class', 'results');
                    myDiv.innerHTML = `
                    <div class="center">
                    <label>Time to Kill</label>
                    </div>
                    <hr width="10%"/>
                    <div class="center">
                        <label id="TTK">${time}</label>
                    </div>
                    <hr width="10%"/>
                    <div class="center">
                        <label id="notes">${notes}</label>
                    </div>
                    `;
                    document.getElementById('resultblock').appendChild(myDiv);
                //}
            }
        }        
    }

    HL.ClearResults = function()
    {
        const results = document.querySelectorAll('.results');

        results.forEach(result => {
            result.remove();
        })
    }
})()