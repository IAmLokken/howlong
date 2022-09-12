'use strict'

;(function()
{
    const PATH = 'data/';

    function LoadData(callback)
    {
        var xhttpBoss = new XMLHttpRequest();
        var xhttpJob = new XMLHttpRequest();
        var xhttpTimeline = new XMLHttpRequest();
        xhttpBoss.onreadystatechange = () => 
        {
            if(xhttpBoss.status == 404 || xhttpBoss.status === 404)
            {
                console.log("ERROR: Cannot find boss file.");
                return;
            }            
            if (xhttpBoss.readyState === 4 && xhttpBoss.status === 200) 
            {
                var json;
                try
                {
                    json = JSON.parse(xhttpBoss.responseText);                            
                }
                catch(e)
                {
                    return;
                }
                HL.BossInfo = json;
                if (callback) callback();
            }
        };

        xhttpJob.onreadystatechange = () => 
        {
            if(xhttpJob.status == 404 || xhttpJob.status === 404)
            {
                console.log("ERROR: Cannot find job file.");
                return;
            }            
            if (xhttpJob.readyState === 4 && xhttpJob.status === 200) 
            {
                var json;
                try
                {
                    json = JSON.parse(xhttpJob.responseText);                            
                }
                catch(e)
                {
                    return;
                }
                HL.JobInfo = json;
                if (callback) callback();
            }
        };

        xhttpTimeline.onreadystatechange = () => 
        {
            if(xhttpTimeline.status == 404 || xhttpTimeline.status === 404)
            {
                console.log("ERROR: Cannot find job file.");
                return;
            }            
            if (xhttpTimeline.readyState === 4 && xhttpTimeline.status === 200) 
            {
                var json;
                try
                {
                    json = JSON.parse(xhttpTimeline.responseText);                            
                }
                catch(e)
                {
                    return;
                }
                HL.TimelineInfo = json;
                if (callback) callback();
            }
        };
    
        xhttpBoss.open('GET', PATH + 'boss_info.json', true);
        xhttpBoss.send();
        xhttpJob.open('GET', PATH + 'job_info.json', true);
        xhttpJob.send();
        xhttpTimeline.open('GET', PATH + 'timelines.json', true);
        xhttpTimeline.send();
    }

    window.HL.LoadData = LoadData;

})()