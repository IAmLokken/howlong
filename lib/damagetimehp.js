'use strict'
;(function()
{   

    HL.GetDamageTime = function(totalHP, strTime, fraTime, lusTime, lusTransformTime, AOE, multiplier)
    {
        let totalTime = 0;
        var playerDPS = AOE && HL.playerAOEDPS > 0 ? (HL.playerAOEDPS * multiplier) : HL.playerBaseDPS;

        // Strength or frailty only
        if (((strTime > 0 && fraTime == 0) || (fraTime > 0 && strTime == 0)) && lusTime == 0 && lusTransformTime == 0)
        {
            let buffTime = strTime > 0 ? strTime : fraTime;
            let hpRemovedOnStrFra = buffTime * (playerDPS * 1.3);

            if (hpRemovedOnStrFra >= totalHP)
            {
                totalTime += totalHP / (playerDPS * 1.3);
                return totalTime;
            }

            let timeOnStrFraDamage = hpRemovedOnStrFra / (playerDPS * 1.3);
            let remainingHP = totalHP - hpRemovedOnStrFra;
            let timeOnBaseDamage = remainingHP / (playerDPS);

            totalTime += timeOnBaseDamage + timeOnStrFraDamage;
            return totalTime;
        }

        // Lust full transformation only
        else if (strTime == 0 && lusTransformTime > 0)
        {
            console.log("Lust transformation applied");
            return totalHP / (HL.lustDPS * multiplier);
        }
        // lust only
        else if (strTime == 0 && lusTransformTime == 0 && lusTime > 0)
        {
            console.log("Lust debuff applied");
            return totalHP / (playerDPS * 1.5);
        }
        // strength and lust
        else if (strTime > 0 && lusTransformTime == 0 && lusTime > 0)
        {
            if (strTime >= lusTime)
            {
                console.log("Strength up during entirety of lust duration.");
                return totalHP / (playerDPS * 1.95);
            }

            let hpRemovedOnBoth = strTime * (playerDPS * 1.95);
            if (hpRemovedOnBoth >= totalHP)
            {
                console.log("Strength up during entirety of lust duration.");
                return totalHP / (playerDPS * 1.95);
            }

            let timeOnBothDamage = hpRemovedOnBoth / (playerDPS * 1.95);
            let remainingHP = totalHP - hpRemovedOnBoth;
            totalTime += timeOnBothDamage;
            totalTime += remainingHP / (playerDPS * 1.5);

            return totalTime;
        }
        // strength and frailty
        else if (strTime > 0 && fraTime > 0)
        {
            let timeWithBoth = strTime >= fraTime ? fraTime : strTime;
            let timeWithOne = strTime >= fraTime ? strTime - fraTime : fraTime - strTime;

            let hpRemovedOnBoth = timeWithBoth * (playerDPS * 1.69);

            if (hpRemovedOnBoth >= totalHP)
            {
                totalTime += totalHP / (playerDPS * 1.69);
                return totalTime;
            }

            let timeOnBothDamage = hpRemovedOnBoth / (playerDPS * 1.69);
            let remainingHP = totalHP - hpRemovedOnBoth;
            totalTime += timeOnBothDamage;

            if (timeWithOne > 0)
            {
                let hpRemovedByOne = timeWithOne * (playerDPS * 1.3);

                if (hpRemovedByOne >= remainingHP)
                {
                    totalTime += remainingHP / (playerDPS * 1.3);
                    return totalTime
                }

                let timeOnOneDamage = hpRemovedByOne / (playerDPS * 1.3);
                remainingHP -= hpRemovedByOne;
                let timeOnBaseDamage = remainingHP / (playerDPS);

                totalTime += timeOnOneDamage + timeOnBaseDamage;
                return totalTime;
            }

            let timeOnBaseDamage = remainingHP / (playerDPS);
            totalTime += timeOnBaseDamage;

            return totalTime;
        }
        // strength and lust full transformation
        else if (strTime > 0 && lusTransformTime > 0)
        {
            if (strTime >= lusTransformTime)
            {
                console.log("Strength and lust tranformation up entire time.");
                return totalHP / (HL.lustDPS * multiplier * 1.3);
            }
            
            let hpRemovedOnBoth = strTime * (HL.lustDPS * multiplier  * 1.3);
            if (hpRemovedOnBoth >= totalHP)
            {
                console.log("Strength and lust tranformation up entire time.");
                return totalHP / (HL.lustDPS * multiplier * 1.3);
            }

            let timeOnBothDamage = hpRemovedOnBoth / (HL.lustDPS * multiplier * 1.3);
            let remainingHP = totalHP - hpRemovedOnBoth;
            totalTime += timeOnBothDamage;
            totalTime += remainingHP / (HL.lustDPS * multiplier );

            return totalTime;
        }
        else
        {
            //console.log("Only base damage.");
            //console.log("Player DPS: " + playerDPS);
            return totalHP / (playerDPS);
        }
    }

})()