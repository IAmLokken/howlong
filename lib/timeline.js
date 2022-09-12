'use strict'
;(function()
{

HL.CalculateTimeline = function(timelineName)
{
    let strDuration = parseFloat(document.getElementById("Strength").value * 60);
    let fraDuration = parseFloat(document.getElementById("Frailty").value * 60);
    let lusDuration = parseFloat(document.getElementById("Lust").value);

    let currentStrDuration = strDuration;
    let currentFraDuration = fraDuration;

    let selectedJobID = document.getElementById("Job").value;
    let selectedDungeon = document.getElementById("DeepDungeon").value;
    let jobList = selectedDungeon == "Palace of the Dead" ? HL.JobInfo.POTD : HL.JobInfo.HOH;
    let selectedJob = jobList[selectedJobID].JOB;


    let timeline = HL.TimelineInfo.TIMELINES[timelineName]["DEFAULT"];
    if (HL.TimelineInfo.TIMELINES[timelineName][selectedJob])
        timeline = HL.TimelineInfo.TIMELINES[timelineName][selectedJob];

    let startingBossHP = parseFloat(HL.bossHP);
    let currentBossHP = startingBossHP;
    let finalTime = 0;

    HL.LustInfo = {};

    HL.LustInfo.lustReserveCount = timeline[timeline.length - 1].LUSTRESERVECOUNT;
    HL.LustInfo.lustCount = lusDuration / 1.5;
    HL.LustInfo.delayLust = timeline[timeline.length - 1].DELAYLUST;
    HL.LustInfo.fullLustDuration = timeline[timeline.length - 1].LUSTFULLDURATION;
    HL.LustInfo.useLust = false;
    HL.LustInfo.DURATION = 0;
    HL.LustInfo.BUFFTIME = 0;
    HL.LustInfo.TRANSFORMTIME = 0;
    HL.LustInfo.lustTransformTime = 0;
    HL.LustInfo.lustTime = 0

    let notes = timeline[timeline.length - 1].NOTES;

    console.log("Boss HP: " + currentBossHP);
    console.log("Final Time: " + finalTime);
    console.log("Lust Reserve Count: " + HL.LustInfo.lustReserveCount);
    console.log("Lust Count: " + HL.LustInfo.lustCount);
    console.log("Delay Lust: " + HL.LustInfo.delayLust);
    console.log("Lust Full Duration: " + HL.LustInfo.fullLustDuration);
    
    // loop through the timeline (except the last entry)
    for (var i = 0; i < timeline.length - 1; i++)
    {
        let timelineEntry = timeline[i];
        let currentEntrySteps = timelineEntry.STEPS;
        let currentEntryLoopCount = parseFloat(timelineEntry.COUNT);
        let loopCount = currentEntryLoopCount > 0 ? currentEntryLoopCount : 999;

        for (var j = 0; j < loopCount; j++)
        {
            for (var k = 0; k < currentEntrySteps.length; k++)
            {
                console.log("STEP NUMBER " + (i + 1) + " BEGIN");
                let type = currentEntrySteps[k].TYPE;
                let duration = parseInt(currentEntrySteps[k].DURATION);
                let durationType = currentEntrySteps[k].DURATIONTYPE;
                let aoehp = currentEntrySteps[k].AOEHP;
                let value = currentEntrySteps[k].VALUE;
                let multiplier = currentEntrySteps[k].MULTIPLIER;
                HL.LustInfo.useLust = currentEntrySteps[k].LUST;

                //console.log("Number of steps: " + currentEntrySteps.length);
                //console.log("timeline entry: " + i + " step: " + k);
                switch(type)
                {
                    case "DPS":
                        {
                            if (durationType == "SEC")
                            {
                                while (duration > 0)
                                {
                                    HL.CalculateLust(duration);
                                    let loopDuration = HL.LustInfo.DURATION > 0 ? HL.LustInfo.DURATION : duration;       
                                    console.log("Lust Tranformation duration: " + HL.LustInfo.TRANSFORMTIME);
                                    console.log("Lust Buff duration: " + HL.LustInfo.BUFFTIME);

                                    // get the damage done in the steps time
                                    let hpDamageDoneToBoss = HL.GetDamageDone(loopDuration, currentStrDuration, currentFraDuration, HL.LustInfo.lustTime, HL.LustInfo.lustTransformTime, false, multiplier);
                                    console.log("damage done to boss: " + hpDamageDoneToBoss + " in " + loopDuration + " seconds");
                                    // if the damage done is more than the remaining hp, find time to damage remaining HP instead
                                    if (hpDamageDoneToBoss > currentBossHP)
                                    {
                                        let timeRemainingToKill = HL.GetDamageTime(currentBossHP, currentStrDuration, currentFraDuration, HL.LustInfo.lustTime, HL.LustInfo.lustTransformTime, false, multiplier);
                                        finalTime += timeRemainingToKill;
                                        currentBossHP = 0;
                                        duration = 0;
                                    }
                                    // otherwise remove the hp from the boss and increment the fight time by the step duration
                                    else
                                    {
                                        currentBossHP = Math.max(0, currentBossHP - hpDamageDoneToBoss);
                                        finalTime += loopDuration;
                                        currentStrDuration = Math.max(0, currentStrDuration - loopDuration);
                                        currentFraDuration = Math.max(0, currentFraDuration - loopDuration);
                                        HL.DecrementLust(loopDuration);
                                        duration = Math.max(0, duration - loopDuration);                        
                                    }                                     
                                }                              
                            }
                            else if (durationType == "HP")
                            {
                                // set the hp to damage to the passed value or the remaining boss hp, whichever is lower
                                let hpToDamage = duration > currentBossHP ? currentBossHP : duration;

                                while (hpToDamage > 0)
                                {
                                    HL.CalculateLust(0);
                                    let loopDuration = HL.LustInfo.DURATION;
                                    console.log("Lust Tranformation duration: " + HL.LustInfo.TRANSFORMTIME);
                                    console.log("Lust Buff duration: " + HL.LustInfo.BUFFTIME);

                                    // if we have lust to consider
                                    if (loopDuration > 0)
                                    {
                                        // get the damage done in this loop
                                        let hpDamageDoneToBoss = HL.GetDamageDone(loopDuration, currentStrDuration, currentFraDuration, HL.LustInfo.lustTime, HL.LustInfo.lustTransformTime, false, multiplier);
                                        let timeToDamageBoss = 0;

                                        // if this loop duration is longer than needed for the hp we are done
                                        if (hpDamageDoneToBoss >= hpToDamage)
                                        {
                                            timeToDamageBoss = HL.GetDamageTime(hpToDamage, currentStrDuration, currentFraDuration, HL.LustInfo.lustTime, HL.LustInfo.lustTransformTime, false, multiplier);
                                            currentBossHP = Math.max(0, currentBossHP - hpToDamage);
                                            hpToDamage = 0;
                                        }
                                        // otherwise we already know the duration and the damage done
                                        else
                                        {
                                            timeToDamageBoss = loopDuration;
                                            currentBossHP = Math.max(0, currentBossHP - hpDamageDoneToBoss);
                                            hpToDamage = Math.max(0, hpToDamage - hpDamageDoneToBoss);
                                        }

                                        //update time and decrement buff durations
                                        finalTime += timeToDamageBoss;
                                        currentStrDuration = Math.max(0, currentStrDuration - timeToDamageBoss);
                                        currentFraDuration = Math.max(0, currentFraDuration - timeToDamageBoss);
                                        HL.DecrementLust(timeToDamageBoss);                                                                                
                                    }
                                    // no lust
                                    else
                                    {
                                        let timeToDamageBoss = HL.GetDamageTime(hpToDamage, currentStrDuration, currentFraDuration, HL.LustInfo.lustTime, HL.LustInfo.lustTransformTime, false, multiplier);
                                        currentBossHP = Math.max(0, currentBossHP - hpToDamage);
                                        currentStrDuration = Math.max(0, currentStrDuration - timeToDamageBoss);
                                        currentFraDuration = Math.max(0, currentFraDuration - timeToDamageBoss);   
                                        finalTime += timeToDamageBoss;
                                        hpToDamage = 0;
                                    }
                                }                                
                            }
                            break;
                        }
                    case "AOE":
                        {
                            if (durationType == "HP")
                            {
                                // set the hp to damage to the passed value or the remaining boss hp, whichever is lower
                                let hpToDamage = aoehp > currentBossHP ? currentBossHP : aoehp;
                                let timeAfterAoe = duration;

                                while (hpToDamage > 0)
                                {
                                    HL.CalculateLust(0);
                                    let loopDuration = HL.LustInfo.DURATION;
                                    console.log("Lust Tranformation duration: " + HL.LustInfo.TRANSFORMTIME);
                                    console.log("Lust Buff duration: " + HL.LustInfo.BUFFTIME);

                                    // if we have lust
                                    if (loopDuration > 0)
                                    {
                                        console.log("Lust Tranformation duration: " + HL.LustInfo.TRANSFORMTIME);
                                        console.log("Lust Buff duration: " + HL.LustInfo.BUFFTIME);
                                        // get the damage done in this loop
                                        let hpDamageDoneToBoss = HL.GetDamageDone(loopDuration, currentStrDuration, currentFraDuration, HL.LustInfo.lustTime, HL.LustInfo.lustTransformTime, true, multiplier);
                                        let timeToDamageBoss = 0;

                                        // if this loop duration is longer than needed for the hp we are done
                                        if (hpDamageDoneToBoss > hpToDamage)
                                        {
                                            timeToDamageBoss = HL.GetDamageTime(hpToDamage, currentStrDuration, currentFraDuration, HL.LustInfo.lustTime, HL.LustInfo.lustTransformTime, true, multiplier);
                                            currentBossHP = Math.max(0, currentBossHP - hpToDamage);
                                            hpToDamage = 0;
                                            console.log("Time to do AOE damage with lust: " + timeToDamageBoss);
                                        }
                                        // otherwise we already know the duration and the damage done
                                        else
                                        {
                                            timeToDamageBoss = loopDuration;
                                            currentBossHP = Math.max(0, currentBossHP - hpDamageDoneToBoss);
                                            hpToDamage = Math.max(0, hpToDamage - hpDamageDoneToBoss);
                                        }
                                        //update time and decrement buff durations
                                        finalTime += timeToDamageBoss;
                                        timeAfterAoe = Math.max(0, timeAfterAoe - timeToDamageBoss);
                                        currentStrDuration = Math.max(0, currentStrDuration - timeToDamageBoss);
                                        currentFraDuration = Math.max(0, currentFraDuration - timeToDamageBoss);  
                                        HL.DecrementLust(timeToDamageBoss);                                          
                                    }
                                    // no lust
                                    else
                                    {
                                        let timeToDamageBoss = HL.GetDamageTime(hpToDamage, currentStrDuration, currentFraDuration, HL.LustInfo.lustTime, HL.LustInfo.lustTransformTime, true, multiplier);
                                        console.log("Time to do " + hpToDamage + " to boss: " + timeToDamageBoss);
                                        currentBossHP = Math.max(0, currentBossHP - hpToDamage);
                                        currentStrDuration = Math.max(0, currentStrDuration - timeToDamageBoss);
                                        currentFraDuration = Math.max(0, currentFraDuration - timeToDamageBoss);  
                                        finalTime += timeToDamageBoss;
                                        timeAfterAoe = Math.max(0, timeAfterAoe - timeToDamageBoss);
                                        console.log("Time left after aoe: " + timeAfterAoe);
                                        console.log("Boss HP left after AOE: " + currentBossHP);
                                        hpToDamage = 0;
                                    }
                                }
                                // now if we have duration left on the step and the boss isnt dead
                                if (timeAfterAoe > 0 && currentBossHP > 0)
                                {
                                    while (timeAfterAoe > 0)
                                    {
                                        HL.CalculateLust(timeAfterAoe);
                                        let loopDuration = HL.LustInfo.DURATION > 0 ? HL.LustInfo.DURATION : timeAfterAoe;
                                        console.log("Lust Tranformation duration: " + HL.LustInfo.TRANSFORMTIME);
                                        console.log("Lust Buff duration: " + HL.LustInfo.BUFFTIME);

                                        // get the damage done in the steps time
                                        let hpDamageDoneToBoss = HL.GetDamageDone(loopDuration, currentStrDuration, currentFraDuration, HL.LustInfo.lustTime, HL.LustInfo.lustTransformTime, false, multiplier);
                                        console.log("Damage done after AOE for " + loopDuration + " seconds: " + hpDamageDoneToBoss);
                                        // if the damage done is more than the remaining hp, find time to damage remaining HP instead
                                        if (currentBossHP - hpDamageDoneToBoss < 0)
                                        {
                                            let timeRemainingToKill = HL.GetDamageTime(currentBossHP, currentStrDuration, currentFraDuration, HL.LustInfo.lustTime, HL.LustInfo.lustTransformTime, false, multiplier);
                                            finalTime += timeRemainingToKill;
                                            currentBossHP = 0;
                                            timeAfterAoe = 0;
                                        }
                                        // otherwise remove the hp from the boss and increment the fight time by the step duration
                                        else
                                        {
                                            currentBossHP = Math.max(0, currentBossHP - hpDamageDoneToBoss);
                                            finalTime += loopDuration;
                                            currentStrDuration = Math.max(0, currentStrDuration - loopDuration);
                                            currentFraDuration = Math.max(0, currentFraDuration - loopDuration);
                                            HL.DecrementLust(loopDuration);   
                                            timeAfterAoe = Math.max(0, timeAfterAoe - loopDuration);                        
                                        } 
                                    } 
                                }                                                            
                            }
                            else if (durationType == "SEC")
                            {
                                while (duration > 0)
                                {
                                    HL.CalculateLust(duration);
                                    let loopDuration = HL.LustInfo.DURATION > 0 ? HL.LustInfo.DURATION : duration;
                                    console.log("Lust Tranformation duration: " + HL.LustInfo.TRANSFORMTIME);
                                    console.log("Lust Buff duration: " + HL.LustInfo.BUFFTIME);

                                    // get the damage done in the steps time
                                    let hpDamageDoneToBoss = HL.GetDamageDone(loopDuration, currentStrDuration, currentFraDuration, HL.LustInfo.lustTime, HL.LustInfo.lustTransformTime, true, multiplier);
                                    // if the damage done is more than the remaining hp, find time to damage remaining HP instead
                                    if (currentBossHP - hpDamageDoneToBoss < 0)
                                    {
                                        let timeRemainingToKill = HL.GetDamageTime(currentBossHP, currentStrDuration, currentFraDuration, HL.LustInfo.lustTime, HL.LustInfo.lustTransformTime, true, multiplier);
                                        finalTime += timeRemainingToKill;
                                        currentBossHP = 0;
                                        duration = 0;
                                    }
                                    // otherwise remove the hp from the boss and increment the fight time by the step duration
                                    else
                                    {
                                        currentBossHP = Math.max(0, currentBossHP - hpDamageDoneToBoss);
                                        finalTime += loopDuration;
                                        currentStrDuration = Math.max(0, currentStrDuration - duration);
                                        currentFraDuration = Math.max(0, currentFraDuration - duration);
                                        HL.DecrementLust(duration);         
                                        duration = Math.max(0, duration - loopDuration);                        
                                    } 
                                }
                            }
                            break;
                        }
                    case "STUN":
                        {
                            console.log("Adding stun of " + duration + " to player.");
                            console.log("Current time spent: " + finalTime);
                            while(duration > 0)
                            {
                                HL.CalculateLust(duration);
                                let loopDuration = HL.LustInfo.DURATION > 0 ? HL.LustInfo.DURATION : duration;
                                console.log("Lust Tranformation duration: " + HL.LustInfo.TRANSFORMTIME);
                                console.log("Lust Buff duration: " + HL.LustInfo.BUFFTIME);
                                if (loopDuration > 0)
                                {
                                    finalTime += loopDuration;
                                    duration = Math.max(0, duration - loopDuration);
                                    currentStrDuration = Math.max(0, currentStrDuration - loopDuration);
                                    currentFraDuration = Math.max(0, currentFraDuration - loopDuration);
                                    HL.DecrementLust(loopDuration);
                                }
                                else
                                {
                                    finalTime += duration;
                                    currentStrDuration = Math.max(0, currentStrDuration - duration);
                                    currentFraDuration = Math.max(0, currentFraDuration - duration);
                                    HL.DecrementLust(duration);
                                    duration = 0;
                                }
                            }        
                            console.log("After stun time spent: " + finalTime);                    
                            break;
                        }
                    case "HP":
                        {
                            let hpToAdd = value;
                            if (HL.dungeonName == 'Palace of the Dead' && HL.bossIndex == 18 && HL.LustInfo.BUFFTIME > 0)
                                hpToAdd *= 1.5;                                
                            currentBossHP = Math.max(0, currentBossHP + hpToAdd);
                            console.log("Applying " + hpToAdd + " HP to boss");
                            break;
                        }
                }
                console.log("Boss HP after step completed: " + currentBossHP);
                console.log("STEP NUMBER " + (i + 1) + " END");
                if (currentBossHP == 0)
                {
                    console.log("We have arrived at a dead boss.  Time: " + finalTime);
                    HL.OutputTimeToKill(finalTime / 60);
                    // format time value and display in html
                    // output all existing timeline outcomes
                    return;
                }
            }
        }        
    }        
}
HL.CalculateLust = function(duration)
{
    // Zero out our values
    HL.LustInfo.lustTransformTime = 0;
    HL.LustInfo.lustTime = 0;
    HL.LustInfo.DURATION = 0;
    
    // if we use a lust on this step and have one we reset the lust timing and remove a lust
    if (HL.LustInfo.useLust && HL.LustInfo.lustCount > 0)
    {
        HL.LustInfo.lustCount = Math.max(0, HL.LustInfo.lustCount - 1);
        HL.LustInfo.lustReserveCount = Math.max(0, HL.LustInfo.lustReserveCount - 1);
        if (HL.LustInfo.fullLustDuration)
            HL.LustInfo.TRANSFORMTIME = 60;
        HL.LustInfo.BUFFTIME = 90;

        if (HL.LustInfo.lustReserveCount == 0)
            HL.LustInfo.delayLust = false;
        
        HL.LustInfo.useLust = false;
    }
    
    // if we have no active lust buff
    if (HL.LustInfo.TRANSFORMTIME == 0 && HL.LustInfo.BUFFTIME == 0)
    {
        // Check to see if we have a lust available and we are either not delaying or we have more lusts than we are reserving
        if (HL.LustInfo.lustCount > 0 && (!HL.LustInfo.delayLust || HL.LustInfo.lustCount > HL.LustInfo.lustReserveCount))
        {
            HL.LustInfo.lustCount = Math.max(0, HL.LustInfo.lustCount - 1);
            if (HL.LustInfo.fullLustDuration)
                HL.LustInfo.TRANSFORMTIME = 60;
            HL.LustInfo.BUFFTIME = 90;
        }
    }

    // if we are using full lust duration
    if (HL.LustInfo.TRANSFORMTIME > 0)
    {
        if (HL.LustInfo.TRANSFORMTIME >= duration)
        {
            HL.LustInfo.DURATION = duration > 0 ? duration : HL.LustInfo.TRANSFORMTIME;
            HL.LustInfo.lustTransformTime = duration > 0 ? duration : HL.LustInfo.TRANSFORMTIME;;
            //HL.LustInfo.TRANSFORMTIME = Math.max(0, HL.LustInfo.TRANSFORMTIME - duration);
        }
        else
        {
            HL.LustInfo.DURATION = HL.LustInfo.TRANSFORMTIME;
            HL.LustInfo.lustTransformTime = HL.LustInfo.TRANSFORMTIME;            
            //HL.LustInfo.TRANSFORMTIME = 0;
        }
    }
    // otherwise we are using the buff
    else if (HL.LustInfo.BUFFTIME > 0)
    {
        if (HL.LustInfo.BUFFTIME >= duration)
        {
            HL.LustInfo.DURATION = duration > 0 ? duration : HL.LustInfo.BUFFTIME;
            HL.LustInfo.lustTime = duration > 0 ? duration : HL.LustInfo.BUFFTIME;
            //HL.LustInfo.BUFFTIME = Math.max(0, HL.LustInfo.BUFFTIME - duration);
        }
        else
        {
            HL.LustInfo.DURATION = HL.LustInfo.BUFFTIME;
            HL.LustInfo.lustTime = HL.LustInfo.BUFFTIME;
            //HL.LustInfo.BUFFTIME = 0;
        }
    }
}
HL.DecrementLust = function(value)
{
    if (HL.LustInfo.TRANSFORMTIME > 0)
        HL.LustInfo.TRANSFORMTIME = Math.max(0, HL.LustInfo.TRANSFORMTIME - value);      
    else                                   
        HL.LustInfo.BUFFTIME = Math.max(0, HL.LustInfo.BUFFTIME - value);
}

})()