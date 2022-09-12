'use strict'
;(function()
{

    HL.GetDamageDone = function(totalTime, strTime, fraTime, lusTime, lusTransformTime, AOE, multiplier, uptime)
    {
        var hpRemoved = 0;
        var playerDPS = AOE && HL.playerAOEDPS > 0 ? (HL.playerAOEDPS * multiplier) : HL.playerBaseDPS;
        playerDPS = playerDPS * uptime;
    
        // strength or frailty only
        if(((strTime > 0 && fraTime == 0) || (fraTime > 0 && strTime == 0)) && lusTime == 0 && lusTransformTime == 0)
        {
            let duration = strTime > 0 ? strTime : fraTime;
    
            if (duration >= totalTime)
            {
                console.log("Strength or Frailty active for entire chunk: " + totalTime);
                hpRemoved += totalTime * (playerDPS * 1.3);
                return hpRemoved;
            }
    
            console.log("Strength or Frailty active for partial chunk: " + duration);
            hpRemoved += duration * (playerDPS * 1.3);
            
            console.log("Base damage active for partial chunk: " + totalTime - duration);
            hpRemoved += (totalTime - duration) * (playerDPS);

            return hpRemoved;
        }
        // lust with full transformation only
        else if (strTime == 0 && lusTransformTime > 0)
        {
            console.log("Lust transformation active for entire chunk: " + totalTime);
            return totalTime * (HL.lustDPS * multiplier);            
        }
        // lust only
        else if (strTime == 0 && lusTransformTime == 0 && lusTime > 0)
        {
            console.log("Lust active for entire chunk: " + totalTime);
            return totalTime * (playerDPS * 1.5);
        }
        // strength and lust
        else if (strTime > 0 && lusTransformTime == 0 && lusTime > 0)
        {
            let timeWithBoth = strTime >= lusTime ? lusTime : strTime;
            let timeWithLust = lusTime >= strTime ? lusTime - strTime : 0;
    
            // strength lust for the entire duration
            if (timeWithBoth >= totalTime)
            {
                console.log("Strength lust active for entire chunk: " + totalTime);
                hpRemoved += totalTime * (playerDPS * 1.95);
                return hpRemoved;
            }
    
            console.log("Strength active for partial lust chunk: " + timeWithBoth);
            hpRemoved += timeWithBoth * (playerDPS * 1.95);
            hpRemoved += timeWithLust * (playerDPS * 1.5);

            return hpRemoved;
        }
        // strength and frailty
        else if (strTime > 0 && fraTime > 0 && lusTime == 0 && lusTransformTime == 0)
        {
            let timeWithBoth = strTime >= fraTime ? fraTime : strTime;
            let timeWithOne = strTime >= fraTime ? strTime - fraTime : fraTime - strTime;
    
            // strength frailty for the entire duration
            if (timeWithBoth >= totalTime)
            {
                console.log("Strength frailty active for entire chunk: " + totalTime);
                hpRemoved += totalTime * (playerDPS * 1.69); 
                return hpRemoved;
            }
    
            console.log("Strength frailty active for partial chunk: " + timeWithBoth);
            hpRemoved += timeWithBoth * (playerDPS * 1.69);
    
            if (timeWithOne >= totalTime - timeWithBoth)
            {
                console.log("Strength or frailty active for partial chunk: " + totalTime - timeWithBoth);
                hpRemoved += (totalTime - timeWithBoth) * (playerDPS * 1.3);
                return hpRemoved;
            }
    
            console.log("Strength or frailty active for partial chunk: " + timewithOne);
            hpRemoved += timewithOne * (playerDPS * 1.3);

            console.log("Base damage active for partial chunk: " + totalTime - timeWithBoth - timeWithOne);
            hpRemoved += (totalTime - timeWithBoth - timeWithOne) * (playerDPS);
            
            return hpRemoved;
        }
        // strength and lust full transformation
        else if (strTime > 0 && lusTransformTime > 0)
        {
            if (strTime >= lusTransformTime)
            {
                console.log("Strength and Lust transformation active for entire chunk: " + totalTime);
                return totalTime * (HL.lustDPS * multiplier * 1.3); 
            }
            console.log("Strength active for part of the lust transformation");
            hpRemoved += strTime * (HL.lustDPS * multiplier * 1.3);
            hpRemoved += (lusTransformTime - strTime) * (HL.lustDPS * multiplier);

            return hpRemoved;
        }
        else
        {
            //console.log("Only base damage.");
            return totalTime * (playerDPS);
        }
    }
})()